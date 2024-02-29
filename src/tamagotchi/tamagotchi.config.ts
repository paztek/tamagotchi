import { registerAs } from '@nestjs/config';

export default registerAs('tamagotchi', () => ({
    interval: parseInt(process.env.TAMAGOTCHI_INTERVAL, 10) || 1000,
}));
