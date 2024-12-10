import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneByUsernameOrEmail(payload.username);

		if (!user) {
			throw new UnauthorizedException();
		}

		if (user.isActive) {
			throw new UnauthorizedException(
				`${user.username}, account ${user.isActive}`,
			);
		}

		return { 
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role
		};
	}
}