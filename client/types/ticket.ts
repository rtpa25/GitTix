export interface Ticket {
    id: string;
    title: string;
    price: number;
    userId: string;
    creator: string;
    description: string;
    imageUrl: string;
    version: number;
    orderId?: string;
    createdAt: string;
    updatedAt: string;
}
