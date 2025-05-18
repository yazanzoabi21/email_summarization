import { ReceivedEmail } from "./received-email";
import { RepliedEmail } from "./replied-email";

export interface ReceivedEmailWithReplies extends ReceivedEmail {
    replies: RepliedEmail[];
}
