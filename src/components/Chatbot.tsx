import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackWidget } from './FeedbackWidget';
import { z } from 'zod';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Input validation schema
const chatMessageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long (max 1000 characters)')
});

const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

export const Chatbot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 0,
        role: 'assistant',
        content: t('chat.welcome'),
        timestamp: new Date()
      }
    ]);
  }, [t]);

  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 150);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Validate input
    try {
      const validated = chatMessageSchema.parse({ content: input });

      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: validated.content,
        timestamp: new Date()
      };

      const currentInput = validated.content;
      setInput('');
      setIsLoading(true);

      // Build conversation history BEFORE adding new message (last 5 messages for context)
      const conversationHistory = messages
        .filter(msg => msg.id !== 0) // Exclude welcome message
        .slice(-5)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Now add user message to UI
      setMessages(prev => [...prev, userMessage]);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // Get anonymousId for tracking
      const anonymousId = localStorage.getItem('anonymousId') || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymousId', anonymousId);

      try {
        // Create initial empty assistant message for streaming
        const assistantMessageId = Date.now() + 1;
        setStreamingMessageId(assistantMessageId);

        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Call proxy backend with SSE
        const response = await fetch(`${PROXY_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            history: conversationHistory,
            anonymousId
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Read SSE stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;

                    // Update streaming message
                    setMessages(prev => prev.map(msg =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: fullResponse }
                        : msg
                    ));
                  }
                } catch (e) {
                  // Ignore JSON parse errors for partial data
                }
              }
            }
          }
        }

        setStreamingMessageId(null);
        setIsLoading(false);

        // Save interaction to Supabase (optional, proxy already saves it)
        try {
          await supabase.functions.invoke('submit-interaction', {
            body: {
              question: currentInput,
              answer: fullResponse,
              anonymousId
            }
          });
        } catch (error) {
          // Silent fail - proxy already saved the interaction
          if (import.meta.env.DEV) {
            console.warn('Supabase save failed (proxy already saved):', error);
          }
        }

      } catch (error) {
        setStreamingMessageId(null);
        setIsLoading(false);

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            toast.error('Request cancelled');
          } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            toast.error(t('chat.error') || 'Cannot connect to server. Please make sure the proxy is running.');
          } else {
            toast.error(error.message || t('chat.error') || 'An error occurred');
          }
        } else {
          toast.error(t('chat.error') || 'An error occurred');
        }

        // Remove the empty assistant message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== (Date.now() + 1)));
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(t('chat.error') || 'An error occurred');
      }
      setIsLoading(false);
    }
  };


  return (
    <section id="chat" className="section-container relative z-10 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground tracking-tight">{t('chat.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('chat.subtitle')}</p>
        </div>

        <Card className="glass-card overflow-hidden shadow-2xl border-white/20 dark:border-white/10">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="h-[600px] overflow-y-auto p-6 md:p-8 space-y-6 chatbot-content bg-white/30 dark:bg-black/20">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${message.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-primary-dark shadow-primary/20'
                    : 'bg-white shadow-lg border border-white/50'
                    }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-6 w-6 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
                    <div className={`rounded-2xl px-6 py-4 shadow-sm ${message.role === 'user'
                      ? 'bg-primary text-white rounded-br-none shadow-primary/10'
                      : 'bg-white/80 backdrop-blur-sm text-foreground border border-white/50 rounded-bl-none shadow'
                      }`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                        {streamingMessageId === message.id && (
                          <span className="inline-block w-1.5 h-4 ml-1 bg-primary align-middle animate-pulse" />
                        )}
                      </p>
                    </div>
                    {message.role === 'assistant' && message.id !== 0 && streamingMessageId !== message.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2"
                      >
                        <FeedbackWidget interactionId={message.id} />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && !streamingMessageId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-lg border border-white/50 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm">
                  <div className="flex gap-1.5 items-center h-6">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scroll Anchor */}
            <div className="h-4"></div>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 bg-white/40 backdrop-blur-md p-4 md:p-6">
            <div className="relative flex gap-3 max-w-4xl mx-auto items-end">
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat.placeholder')}
                  disabled={isLoading}
                  className="relative flex-1 bg-white/80 border-2 border-primary/40 rounded-xl py-6 px-4 shadow-inner text-base focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className={`h-12 w-12 rounded-xl shadow-lg transition-all duration-300 ${!input.trim() || isLoading
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 hover:shadow-primary/25'
                  }`}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Rare Help provides information, not medical advice. Consult a healthcare professional.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
