import { InternalServerErrorException } from "@nestjs/common";

const url = 'https://bes-dev.github.io/telegram_stars_rates/api.json';

export const getStarsPriceUsdt = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch{
        console.error('cant get stars price');
        throw new InternalServerErrorException();
    }
}