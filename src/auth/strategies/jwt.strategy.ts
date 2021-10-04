import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "src/config/constants";
import { UserService } from "src/user/user.service";

Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private UserService: UserService,
        private config: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>(JWT_SECRET),
        }); 
    }

    async validate(payload: any){
        const{sub:id} = payload;
        return await this.UserService.getOne(id);
    }

}