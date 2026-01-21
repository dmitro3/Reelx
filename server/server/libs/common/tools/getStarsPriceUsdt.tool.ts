import { InternalServerErrorException } from "@nestjs/common";

const url = 'https://bes-dev.github.io/telegram_stars_rates/api.json';

export const getCurrancyRates = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            stars: data.usdt_per_star,
            ton: data.usdt_per_ton
        };
    }
    catch{
        console.error('cant get stars price');
        throw new InternalServerErrorException();
    }
}