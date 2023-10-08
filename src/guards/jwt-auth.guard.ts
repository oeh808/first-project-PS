import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/role.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    const index = request.rawHeaders.indexOf("Authorization")+1;
    const token = request.rawHeaders[index];

    const role = this.extractRole(token);

    return super.canActivate(context) && roles.includes(role); 
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      return err || new UnauthorizedException(); 
    }
    return user;
  }

  extractRole(token: string) {
    //console.log(token);
    const temp = atob(token.split('.')[1]);
    const role = temp.split(',')[1].split(':')[1].slice(1,-1);
    //console.log(temp);

    return role;
}
}
