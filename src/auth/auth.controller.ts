import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { User, Auth} from 'src/common/decorators';
import { User as UserEntity } from 'src/user/entities';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body() LoginDto: LoginDto,
        @User() user: UserEntity
    ){
        const data = await this.authService.login(user)
        return {
            message: 'Login exitoso',
            data
        };
    }

    @Auth()
    @Get('profile')
    profile(
        @User() user: UserEntity
    ){
        return {
            message: 'Peticion correcta',
            user
        };
    }
}
