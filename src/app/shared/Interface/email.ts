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
  recipient: string;
  subject: string;
  preview: string;
  body: string;
  cc: string;
  bcc: string;
  time: string;
  status: string;
  isRead: boolean;
  isStarred: boolean;
}
