export interface ITamagotchi extends TamagotchiState {
    id: string;
    name: string | null;
    ranges: {
        sleep: [number, number];
        hunger: [number, number];
        happiness: [number, number];
    };
}

export interface TamagotchiState {
    sleep: number;
    hunger: number;
    happiness: number;
}

export interface TamagotchiRanges {
    sleep: [number, number];
    hunger: [number, number];
    happiness: [number, number];
}

export const MAX_SLEEP = 100;
export const MAX_HUNGER = 100;
export const MAX_HAPPINESS = 100;

export const MIN_SLEEP = 0;
export const MIN_HUNGER = 0;
export const MIN_HAPPINESS = 0;

export const DEFAULT_SLEEP = 50;
export const DEFAULT_HUNGER = 50;
export const DEFAULT_HAPPINESS = 50;

export const DEFAULT_TAMAGOTCHI_STATE: TamagotchiState = {
    sleep: DEFAULT_SLEEP,
    hunger: DEFAULT_HUNGER,
    happiness: DEFAULT_HAPPINESS,
};

export const DEFAULT_TAMAGOTCHI_RANGES: TamagotchiRanges = {
    sleep: [MIN_SLEEP, MAX_SLEEP],
    hunger: [MIN_HUNGER, MAX_HUNGER],
    happiness: [MIN_HAPPINESS, MAX_HAPPINESS],
};
