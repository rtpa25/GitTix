export interface Ticket {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
    createdAt: string;
    updatedAt: string;
}
