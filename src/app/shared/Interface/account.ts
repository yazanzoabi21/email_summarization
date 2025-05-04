export interface Account {
    full_name: string;
    email: string;
    password: string;
    expired?: boolean;
    isCurrent?: boolean;
    isLoggedOut?: boolean;
}