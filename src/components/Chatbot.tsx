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
    <section id="chat" className="section-container bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-2 text-foreground">{t('chat.title')}</h2>
          <p className="text-base text-muted-foreground">{t('chat.subtitle')}</p>
        </div>

        <Card className="shadow-md border-border">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="h-[500px] overflow-y-auto p-6 space-y-4 chatbot-content">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-primary'
                      : 'bg-muted border border-border'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className={`rounded-md px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground border border-border'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                        {streamingMessageId === message.id && (
                          <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                        )}
                      </p>
                    </div>
                    {message.role === 'assistant' && message.id !== 0 && streamingMessageId !== message.id && (
                      <FeedbackWidget interactionId={message.id} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && !streamingMessageId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted border border-border rounded-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                disabled={isLoading}
                className="flex-1 rounded-md chatbot-input-text"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-primary hover:bg-primary-dark transition-colors rounded-md"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
