import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if(!authHeader){
      throw new UnauthorizedException('No Token Provided');
    }

    const token = authHeader.split(' ')[1];
    try{
      //verify the token
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      //attach user to request
      request.user = {
        id:decoded.id,
        email: decoded.email,
      };
      return true;
    } catch (error){
        throw new UnauthorizedException('Invalid or expired token');
    }
    
  }
}
