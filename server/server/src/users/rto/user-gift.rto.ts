export class UserGiftRto {
    id: string;
    giftName: string;
    image?: string;
    /** URL lottie-анимации */
    lottieUrl?: string;
    price?: number;
    isOut: boolean;
    createdAt: Date;
}
