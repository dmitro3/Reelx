import { Injectable } from "@nestjs/common";
import { RedisService } from "../../../../infrustructure/redis/redis.service";
import { getCurrancyRates } from "../../../tools/getStarsPriceUsdt.tool";
import { getTonPriceUsdt } from '../../../tools/getTonPriceUsdt.tool'

@Injectable()
export class CurrancyService {

    constructor(
        private readonly redisService: RedisService,
    ) {
        setTimeout(() => this.getCurrancyRates().then(console.log), 5000)
    }
   
    async getCurrancyRates() {
        const tonPriceFromCache = await this.redisService.get('ton_price_usdt');
        const starsPriceFromCache = await this.redisService.get('stars_price_usdt');

        if (tonPriceFromCache && starsPriceFromCache) {
            return {
                ton: JSON.parse(tonPriceFromCache),
                stars: JSON.parse(starsPriceFromCache),
            };
        }
        const currancyFromApi = await getCurrancyRates();
        const tonPrice = await getTonPriceUsdt();
        await this.redisService.set('ton_price_usdt', JSON.stringify(tonPrice.toFixed(2)), 60 * 60 * 24);
        await this.redisService.set('stars_price_usdt', JSON.stringify(currancyFromApi.stars), 60 * 60 * 24);

        return {
            ton: Number(tonPrice.toFixed(2)),
            stars: currancyFromApi.stars,
        };
    }
}