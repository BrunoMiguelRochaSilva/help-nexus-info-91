export interface Discussion {
  id: string;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  replies_count: number;
}

export interface Reply {
  id: string;
  discussion_id: string;
  body: string;
  author_name: string;
  created_at: string;
  likes_count: number;
}

export interface DiscussionLike {
  id: string;
  discussion_id: string;
  user_identifier: string;
}

export interface ReplyLike {
  id: string;
  reply_id: string;
  user_identifier: string;
}
