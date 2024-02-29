import { Injectable } from '@nestjs/common';
import { ITamagotchi } from '../domain/tamagotchi.model';
import { ITamagotchiRepository } from '../domain/tamagotchi.repository';

@Injectable()
export class MemoryTamagotchiRepository implements ITamagotchiRepository {
    private readonly tamagotchis = new Map<string, ITamagotchi>();

    async find(id: string): Promise<ITamagotchi | null> {
        const tamagotchi = this.tamagotchis.get(id);

        return tamagotchi ?? null;
    }

    async findAll(): Promise<ITamagotchi[]> {
        return Array.from(this.tamagotchis.values());
    }

    async update(tamagotchi: ITamagotchi): Promise<void> {
        this.tamagotchis.set(tamagotchi.id, tamagotchi);
    }
}
