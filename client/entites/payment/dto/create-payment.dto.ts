export enum PaymentType {
    STARS = 'stars',
}

export interface CreatePaymentDto {
    invoiceLink: string;
    amount: number;
    type: PaymentType;
}