import {
    CallHandler,
    createParamDecorator,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TamagotchiService } from '../domain/tamagotchi.service';

@Injectable()
export class TamagotchiInterceptor implements NestInterceptor {
    constructor(private readonly service: TamagotchiService) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const id = request.params.id;

        try {
            request.tamagotchi = this.service.get(id);

            return next.handle();
        } catch (error) {
            throw new NotFoundException('Tamagotchi not found');
        }
    }
}

export const TamagotchiFetched = createParamDecorator((_, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tamagotchi;
});
