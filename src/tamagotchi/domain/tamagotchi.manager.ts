import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import tamagotchiConfig from '../tamagotchi.config';
import { ITamagotchi } from './tamagotchi.model';
import {
    ITamagotchiRepository,
    TAMAGOTCHI_REPOSITORY_TOKEN,
} from './tamagotchi.repository';

@Injectable()
export class TamagotchiManager
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private readonly logger = new Logger(TamagotchiManager.name);
    private readonly timers = new Map<string, NodeJS.Timeout>();
    private readonly interval: number;

    constructor(
        @Inject(TAMAGOTCHI_REPOSITORY_TOKEN)
        private readonly repository: ITamagotchiRepository,
        @Inject(tamagotchiConfig.KEY)
        config: ConfigType<typeof tamagotchiConfig>,
    ) {
        this.interval = config.interval;
    }

    async onApplicationBootstrap(): Promise<void> {
        // Reload all tamagotchis and start their timers
        const tamagotchis = await this.repository.findAll();
        for (const tamagotchi of tamagotchis) {
            this.manage(tamagotchi.id);
        }
    }

    onApplicationShutdown(): any {
        // Clear all timers
        for (const timer of this.timers.values()) {
            clearInterval(timer);
        }
    }

    manage(id: string): void {
        this.logger.log(`Managing tamagotchi ${id}...`);
        const timer = this.startTimer(id);
        this.timers.set(id, timer);
    }

    private startTimer(id: string): NodeJS.Timeout {
        return setInterval(async () => {
            // Random event in ['hunger', 'sleep', 'happiness']
            const event = ['hunger', 'sleep', 'happiness'][
                Math.floor(Math.random() * 3)
            ];
            // Random amount in [-5, 0]
            const amount = Math.floor(Math.random() * 6) - 5;

            let tamagotchi = await this.repository.find(id);
            if (!tamagotchi) {
                this.logger.warn(`Tamagotchi ${id} not found.`);
                return;
            }

            // Update tamagotchi
            tamagotchi = {
                ...tamagotchi,
                [event]: Math.max(
                    tamagotchi.ranges[event][0],
                    Math.min(
                        tamagotchi.ranges[event][1],
                        tamagotchi[event] + amount,
                    ),
                ),
            };

            this.logger.log(
                `[${tamagotchi.id}] ${event} ${amount} => ${tamagotchi[event]}`,
            );

            // Persist it
            await this.repository.update(tamagotchi);
        }, this.interval);
    }
}
