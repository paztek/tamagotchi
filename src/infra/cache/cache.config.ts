import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
    uri: process.env.REDIS_URI ?? 'redis://localhost:6379',
    keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'tamagotchi:',
}));
