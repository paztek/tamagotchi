import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TamagotchiModule } from './tamagotchi/tamagotchi.module';

@Module({
    imports: [ConfigModule.forRoot(), TamagotchiModule],
})
export class AppModule {}
