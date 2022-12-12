export interface Ticket {
    id: string;
    title: string;
    price: number;
    userId: string;
    creator: string;
    imageUrl: string;
    version: number;
    orderId?: string;
    createdAt: string;
    updatedAt: string;
}
