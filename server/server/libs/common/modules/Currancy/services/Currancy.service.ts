import { Injectable } from "@nestjs/common";
import { RedisService } from "../../../../infrustructure/redis/redis.service";
import { getCurrancyRates } from "../../../tools/getStarsPriceUsdt.tool";

@Injectable()
export class CurrancyService {

    constructor(
        private readonly redisService: RedisService,
    ) {}
   
    async getCurrancyRates() {
        const tonPriceFromCache = await this.redisService.get('ton_price_usdt');
        const starsPriceFromCache = await this.redisService.get('stars_price_usdt');
        if (tonPriceFromCache && starsPriceFromCache) {
            return JSON.parse(tonPriceFromCache) as { ton: number, stars: number };
        }
        const currancyFromApi = await getCurrancyRates();
        await this.redisService.set('ton_price_usdt', JSON.stringify(currancyFromApi.ton), 60 * 60 * 24);
        await this.redisService.set('stars_price_usdt', JSON.stringify(currancyFromApi.stars), 60 * 60 * 24);
        return {
            ton: currancyFromApi.ton,
            stars: currancyFromApi.stars,
        };
    }
}