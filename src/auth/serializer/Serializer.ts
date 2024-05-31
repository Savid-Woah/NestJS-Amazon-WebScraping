import { PassportSerializer } from "@nestjs/passport";
import { use } from "passport";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../user/repository/UserRepository";

@Injectable()
export class SessionSerializer extends PassportSerializer {

    constructor(private readonly userRepository: UserRepository) {
        super()
    }

    serializeUser(user: any, done: Function) {
        done(null, user)
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.userRepository.findById(payload.id)
        return user ? done(null, use) : done(null, null)
    }
}