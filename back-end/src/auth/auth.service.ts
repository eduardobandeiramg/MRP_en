import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Request as ExpressRequest } from 'express';
import { nanoid } from 'nanoid';
import { MailService } from 'src/mails/mail.service';
import { UsersService } from 'src/users/users.service';
import { MoreThan, Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetToken } from './entitites/reset-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser({ username, password }: LoginDto) {
    const user = await this.usersService.findOneByUsernameOrEmail(username);
    if (!user) {
      return null;
    }
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
    } catch (e) {
      return null;
    }
    return user;
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    request: ExpressRequest,
  ) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findOneByUsernameOrEmail(email);

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const token = nanoid(64);
      const resetToken = await this.resetTokensRepository.create({
        token,
        user,
        expiryDate,
      });

      try {
        await this.resetTokensRepository.save(resetToken);
      } catch (e) {
        return { message: 'If this user exists, they will receive an email' };
      }
      this.mailService.sendPasswordResetEmail(email, token, request);
    }

    return { message: 'If this user exists, they will receive an email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const currentDate = new Date();

    const token = await this.resetTokensRepository.findOne({
      where: {
        token: resetPasswordDto.resetToken,
        expiryDate: MoreThan(currentDate),
      },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    const user = await this.usersService.updatePassword(
      token.user.id,
      resetPasswordDto.password,
    );
    await user;
  }
}
