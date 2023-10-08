import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/users/user-roles.enum';

export const Roles = Reflector.createDecorator<string[]>();