export interface Email {
  id: number;
  sender: string;
  sender_email: string;
  recipient: string;
  recipient_email: string;
  subject: string;
  preview: string;
  body: string;
  cc: string;
  bcc: string;
  time: string;
  date?: string; // ✅ ADD THIS
  status: string;
  isRead: boolean;
  isStarred: boolean;
  thread_id?: string;
  replyCount?: number;
}
