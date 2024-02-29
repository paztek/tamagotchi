import { Inject, Injectable, Logger } from '@nestjs/common';
import { TamagotchiManager } from './tamagotchi.manager';
import {
    DEFAULT_TAMAGOTCHI_RANGES,
    DEFAULT_TAMAGOTCHI_STATE,
    ITamagotchi,
} from './tamagotchi.model';
import {
    ITamagotchiRepository,
    TAMAGOTCHI_REPOSITORY_TOKEN,
} from './tamagotchi.repository';

@Injectable()
export class TamagotchiService {
    private readonly logger = new Logger(TamagotchiService.name);

    constructor(
        @Inject(TAMAGOTCHI_REPOSITORY_TOKEN)
        private readonly repository: ITamagotchiRepository,
        private readonly manager: TamagotchiManager,
    ) {}

    async get(id: string): Promise<ITamagotchi> {
        this.logger.log(`Retrieving tamagotchi ${id}...`);

        let tamagotchi = await this.repository.find(id);

        if (!tamagotchi) {
            // Build new tamagotchi
            tamagotchi = {
                id,
                name: null,
                ...DEFAULT_TAMAGOTCHI_STATE,
                ranges: DEFAULT_TAMAGOTCHI_RANGES,
            };

            // Persist it
            await this.repository.update(tamagotchi);

            // Manage it
            this.manager.manage(tamagotchi.id);
        }

        return tamagotchi;
    }

    async feed(tamagotchi: ITamagotchi, amount: number): Promise<ITamagotchi> {
        this.logger.log(`Feeding tamagotchi ${tamagotchi.id}...`);

        amount = this.normalizeAmount(amount);

        // Update tamagotchi
        tamagotchi = {
            ...tamagotchi,
            hunger: Math.max(
                tamagotchi.ranges.hunger[0],
                Math.min(
                    tamagotchi.ranges.hunger[1],
                    tamagotchi.hunger + amount,
                ),
            ),
        };

        // Persist it
        await this.repository.update(tamagotchi);

        return tamagotchi;
    }

    async sleep(tamagotchi: ITamagotchi, amount: number): Promise<ITamagotchi> {
        this.logger.log(`Putting tamagotchi ${tamagotchi.id} to sleep...`);

        amount = this.normalizeAmount(amount);

        // Update tamagotchi
        tamagotchi = {
            ...tamagotchi,
            sleep: Math.max(
                tamagotchi.ranges.sleep[0],
                Math.min(tamagotchi.ranges.sleep[1], tamagotchi.sleep + amount),
            ),
        };

        // Persist it
        await this.repository.update(tamagotchi);

        return tamagotchi;
    }

    async play(tamagotchi: ITamagotchi, amount: number): Promise<ITamagotchi> {
        this.logger.log(`Playing with tamagotchi ${tamagotchi.id}...`);

        amount = this.normalizeAmount(amount);

        // Update tamagotchi
        tamagotchi = {
            ...tamagotchi,
            happiness: Math.max(
                tamagotchi.ranges.happiness[0],
                Math.min(
                    tamagotchi.ranges.happiness[1],
                    tamagotchi.happiness + amount,
                ),
            ),
        };

        // Persist it
        await this.repository.update(tamagotchi);

        return tamagotchi;
    }

    async name(tamagotchi: ITamagotchi, name: string): Promise<ITamagotchi> {
        tamagotchi = {
            ...tamagotchi,
            name,
        };

        // Persist it
        await this.repository.update(tamagotchi);

        return tamagotchi;
    }

    private normalizeAmount(amount: number): number {
        if (
            amount === undefined ||
            amount === null ||
            typeof amount !== 'number' ||
            isNaN(amount)
        ) {
            return 5;
        }
        return amount;
    }
}
