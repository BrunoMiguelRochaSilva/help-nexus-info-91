export interface PrivateMessage {
  id: string;
  sender_name: string;
  receiver_name: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  otherUser: string;
  lastMessage: PrivateMessage;
  unreadCount: number;
}
