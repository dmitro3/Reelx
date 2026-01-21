import { Global, Module } from "@nestjs/common";
import { CurrancyService } from "./services/Currancy.service";

@Global()
@Module({
    imports: [],
    providers: [CurrancyService],
    exports: [CurrancyService],
})
export class CurrancyModule {}