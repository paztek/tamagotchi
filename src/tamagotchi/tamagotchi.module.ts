import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../infra/cache/cache.module';
import { TamagotchiController } from './controllers/tamagotchi.controller';
import { TamagotchiManager } from './domain/tamagotchi.manager';
import { TAMAGOTCHI_REPOSITORY_TOKEN } from './domain/tamagotchi.repository';
import { TamagotchiService } from './domain/tamagotchi.service';
import { CacheTamagotchiRepository } from './repos/cache.tamagotchi.repository';
import tamagotchiConfig from './tamagotchi.config';

@Module({
    imports: [ConfigModule.forFeature(tamagotchiConfig), CacheModule],
    controllers: [TamagotchiController],
    providers: [
        TamagotchiService,
        TamagotchiManager,
        {
            provide: TAMAGOTCHI_REPOSITORY_TOKEN,
            useClass: CacheTamagotchiRepository,
        },
    ],
})
export class TamagotchiModule {}
