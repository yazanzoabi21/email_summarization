export interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hover?: boolean;
}
