import { ITamagotchi } from './tamagotchi.model';

export const TAMAGOTCHI_REPOSITORY_TOKEN = Symbol('ITamagotchiRepository');

export interface ITamagotchiRepository {
    find(id: string): Promise<ITamagotchi | null>;
    findAll(): Promise<ITamagotchi[]>;
    update(tamagotchi: ITamagotchi): Promise<void>;
}
