export interface RepliedEmail {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  cc?: string | null;
  bcc?: string | null;
  replied_at: string;
  original_message_id: string;
  time?: string;

  children?: RepliedEmail[];
}
