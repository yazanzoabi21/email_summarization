export interface Account {
    name: string;
    email: string;
    expired?: boolean;
    isCurrent?: boolean;
}