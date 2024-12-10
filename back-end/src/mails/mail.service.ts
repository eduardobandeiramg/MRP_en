import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: configService.getOrThrow<string>('EMAIL_HOST'),
            port: configService.getOrThrow('EMAIL_PORT'),
            auth: {
                user: configService.getOrThrow<string>('EMAIL_USER'),
                pass: configService.getOrThrow<string>('EMAIL_PASSWORD')
            }
        });
    }

    async sendPasswordResetEmail(to: string, token: string, request: ExpressRequest) {
        const resetLink = `${request.protocol}://${request.headers.host}/reset-password?token=${token}`;
        const mailOptions = {
            from: 'MRP',
            to: to,
            subject: 'Password Reset Request',
            html: 
            `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="text-align: center; color: #4CAF50;">MRP Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested to reset your password. Please click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Password</a>
                </div>
                <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                <p style="word-break: break-all;"><a href="${resetLink}" style="color: #4CAF50;">${resetLink}</a></p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
                <p style="margin-top: 40px; font-size: 12px; color: #777;">Thank you,<br/>MRP Team</p>
            </div>`
        };
    
        await this.transporter.sendMail(mailOptions);
    }
}
