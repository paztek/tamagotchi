import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CacheModule as BaseCacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import cacheConfig from './cache.config';

@Module({
    imports: [
        BaseCacheModule.registerAsync({
            imports: [ConfigModule.forFeature(cacheConfig)],
            useFactory: (config: ConfigType<typeof cacheConfig>) => {
                const uri = new URL(config.uri);
                return {
                    store: redisStore,
                    password: uri.password ? uri.password : undefined,
                    host: uri.hostname,
                    port: parseInt(uri.port, 10) || 6379,
                    commandTimeout: 10000,
                    enableReadyCheck: true,
                    keyPrefix: config.keyPrefix,
                };
            },
            inject: [cacheConfig.KEY],
        }),
    ],
    exports: [BaseCacheModule],
})
export class CacheModule {}
