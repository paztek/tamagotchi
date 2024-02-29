import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache, Store } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as _ from 'lodash';
import { ITamagotchi } from '../domain/tamagotchi.model';
import { ITamagotchiRepository } from '../domain/tamagotchi.repository';

interface RedisCache extends Cache {
    store: RedisStore;
}

interface RedisStore extends Store {
    name: 'redis';
    getClient: () => Redis;
}

@Injectable()
export class CacheTamagotchiRepository implements ITamagotchiRepository {
    private readonly keyPrefix: string;

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: RedisCache,
    ) {
        const client = this.cache.store.getClient();
        this.keyPrefix = client.options.keyPrefix;
    }

    async find(id: string): Promise<ITamagotchi | null> {
        const tamagotchi = await this.cache.get<ITamagotchi>(id);
        return tamagotchi ?? null;
    }

    async findAll(): Promise<ITamagotchi[]> {
        const rawKeys = await this.cache.store.keys(`${this.keyPrefix}*`);
        const keys = rawKeys.map((key) => key.replace(this.keyPrefix, ''));
        const tamagotchis = await Promise.all(
            keys.map((key) => this.cache.get<ITamagotchi>(key)),
        );

        return _.compact(tamagotchis);
    }

    update(tamagotchi: ITamagotchi): Promise<void> {
        return this.cache.set(tamagotchi.id, tamagotchi, 3600 * 24 * 7 * 1000);
    }
}
