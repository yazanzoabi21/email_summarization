export interface ReceivedEmail {
    id: number;
    email_id: string;
    from: string;
    subject: string;
    snippet: string;
    body?: string;
    time?: string;
    received_at: string;
    thread_id: string;
    message_id: string;
    isRead: boolean;

    attachments?: {
        filename: string;
        mimeType: string;
        base64: string;
    }[];
}
