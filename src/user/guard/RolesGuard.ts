import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enum/Role";
import { User } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles) {
            return true;
        } 
            
        const request = context.switchToHttp().getRequest()
        const user: User = request.user

        return requiredRoles.some((role) => user.roles.includes(role))
    };
}