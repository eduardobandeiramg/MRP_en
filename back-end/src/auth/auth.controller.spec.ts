import { Test, TestingModule } from '@nestjs/testing';
import { Request as ExpressRequest } from 'express';
import { ClientRole } from 'src/users/enums/role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: jest.Mocked<UsersService>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
    };

    const mockAuthService = {
      login: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  describe('register', () => {
    it('deve chamar o método create no UsersService com os dados corretos', async () => {
      const mockRegisterDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: ClientRole.Administrator,
      };

      usersService.create.mockResolvedValue(undefined);

      const result = await authController.register(mockRegisterDto);

      expect(usersService.create).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('deve chamar o método login no AuthService com os dados corretos e retornar o token', async () => {
      const mockUser = {
        username: 'testuser',
        id: '123',
      };

      const mockRequest: any = {
        user: mockUser,
      };

      const mockResult = { token: 'mock-jwt-token' };
      authService.login.mockResolvedValue(mockResult);

      const result = await authController.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('forgotPassword', () => {
    it('deve chamar o método forgotPassword no AuthService com os dados corretos', async () => {
      const mockRequest = {} as ExpressRequest;
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'testuser@example.com',
      };

      const mockResult = {
        message: 'If this user exists, they will receive an email',
      };
      authService.forgotPassword.mockResolvedValue(mockResult);

      const result = await authController.forgotPassword(
        mockRequest,
        forgotPasswordDto,
      );

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
        mockRequest,
      );
      expect(result).toEqual(mockResult);
    });
  });
  describe('resetPassword', () => {
    it('deve chamar o método resetPassword no AuthService com os dados corretos', async () => {
      const resetPasswordDto = {
        resetToken: 'mock-reset-token',
        password: 'newpassword123',
      };

      authService.resetPassword.mockResolvedValue(undefined);

      const result = await authController.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toBeUndefined();
    });
  });
});
