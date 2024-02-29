import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseInterceptors,
} from '@nestjs/common';
import { ITamagotchi } from '../domain/tamagotchi.model';
import { TamagotchiService } from '../domain/tamagotchi.service';
import tamagotchiConfig from '../tamagotchi.config';
import {
    TamagotchiFetched,
    TamagotchiInterceptor,
} from './tamagotchi.interceptor';

@UseInterceptors(TamagotchiInterceptor)
@Controller('tamagotchis/:id')
export class TamagotchiController {
    constructor(private readonly service: TamagotchiService) {}

    @Get()
    async get(
        @TamagotchiFetched() tamagotchi: ITamagotchi,
    ): Promise<ITamagotchi> {
        return tamagotchi;
    }

    @Post('feed')
    async feed(
        @TamagotchiFetched() tamagotchi: ITamagotchi,
        @Body() dto: { amount: number },
    ): Promise<ITamagotchi> {
        return this.service.feed(tamagotchi, dto.amount);
    }

    @Post('sleep')
    async sleep(
        @TamagotchiFetched() tamagotchi: ITamagotchi,
        @Body() dto: { amount: number },
    ): Promise<ITamagotchi> {
        return this.service.sleep(tamagotchi, dto.amount);
    }

    @Post('play')
    async play(
        @TamagotchiFetched() tamagotchi: ITamagotchi,
        @Body() dto: { amount: number },
    ): Promise<ITamagotchi> {
        return this.service.play(tamagotchi, dto.amount);
    }

    @Put('name')
    async name(
        @TamagotchiFetched() tamagotchi: ITamagotchi,
        @Body() dto: { name: string },
    ): Promise<ITamagotchi> {
        tamagotchi = await this.service.name(tamagotchi, dto.name);
        return tamagotchi;
    }
}
