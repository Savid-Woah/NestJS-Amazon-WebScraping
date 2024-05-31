import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LocalGaurd } from "../guard/LocalGuard";
import { Request, Response } from "express";
import { GoogleAuthGuard } from "../guard/GoogleAuthGaurd";
import { FacebookAuthGuard } from "../guard/FacebookAuthGuard";
import { ConfigService } from "@nestjs/config";

@Controller('auth')
export class AuthController {

    private readonly frontEndUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.frontEndUrl = this.configService.get<string>('FRONT_END_URL');
    }

    @Post('login')
    @UseGuards(LocalGaurd)
    async login(@Req() req: Request) {
        return req.user
    }

    @Get('google-login')
    @UseGuards(GoogleAuthGuard)
    async handleGoogleLogin() {
    }

    @Get('google-callback')
    @UseGuards(GoogleAuthGuard)
    async handleGoogleCallBack(@Req() req: Request, @Res() res: Response) {
        return res.redirect(`${this.frontEndUrl}/login?token=${req.user}`)
    }

    @Get('facebook-login')
    @UseGuards(FacebookAuthGuard)
    async handleFacebookLogin() {
    }

    @Get('facebook-callback')
    @UseGuards(FacebookAuthGuard)
    async handleFacebookCallBack(@Req() req: Request, @Res() res: Response) {
        return res.redirect(`${this.frontEndUrl}/login?token=${req.user}`)
    }
}