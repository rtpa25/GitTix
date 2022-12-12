import { Ticket } from './ticket';

export interface Order {
    id: string;
    status: string;
    expiresAt: string;
    ticket: Exclude<Ticket, 'username' | 'userId'>;
    userId: string;
    creator: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}
