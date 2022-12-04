export interface User {
    id: string;
    email: string;
}

export interface CurrentUserResult {
    currentUser: User | null;
}
