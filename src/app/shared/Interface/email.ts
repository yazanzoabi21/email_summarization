// export interface Email {
//   id: number;
//   sender: string;
//   subject: string;
//   preview: string;
//   time: string;
//   isRead: boolean;
//   isStarred: boolean;
//   hover?: boolean;
// }

export interface Email {
  id: number;
  sender: string;
  to: string;
  subject: string;
  preview: string;
  cc: string;
  bcc: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
}