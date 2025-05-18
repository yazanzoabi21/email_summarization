export interface ReceivedEmail {
    id: number;
    email_id: string;
    message_id: string;
    thread_id: string;
    from: string;
    subject: string;
    snippet: string;
    body?: string;
    time?: string;
    received_at: string;
    isRead: boolean;
    attachments?: {
        filename: string;
        mimeType: string;
        base64: string;
    }[];
}
