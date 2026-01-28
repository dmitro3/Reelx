import { InternalServerErrorException } from "@nestjs/common";
const url = 'https://tonapi.io/v2/rates?tokens=ton&currencies=usd';


export const getTonPriceUsdt = async (): Promise<number> => {
    try {
        const response = await fetch(String(url));
        const data = await response.json();
        return data.rates.TON.prices.USD;
    }
    catch{
        console.error('cant get ton price');
        throw new InternalServerErrorException();
    }
}