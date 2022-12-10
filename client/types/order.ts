import { Ticket } from './ticket';

export interface Order {
    id: string;
    status: string;
    expiresAt: string;
    ticket: Ticket;
    userId: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}
