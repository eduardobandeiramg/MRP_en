import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/mails/mail.service';
import { ClientRole } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetToken } from './entitites/reset-token.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let usersService: jest.Mocked<UsersService>;
  let mailService: jest.Mocked<MailService>;
  let resetTokenRepository: jest.Mocked<any>;
  let mockBcryptCompare: jest.SpyInstance;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockUsersService = {
      findOneByUsernameOrEmail: jest.fn(),
    };

    const mockResetTokenRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockMailService = {
      sendPasswordResetEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: getRepositoryToken(ResetToken),
          useValue: mockResetTokenRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    mailService = module.get<MailService>(
      MailService,
    ) as jest.Mocked<MailService>;
    resetTokenRepository = module.get(
      getRepositoryToken(ResetToken),
    ) as jest.Mocked<any>;

    mockBcryptCompare = jest.spyOn(bcrypt, 'compare');
  });

  describe('login', () => {
    it('deve retornar um token JWT para o usuário fornecido', async () => {
      const mockUser = {
        username: 'testuser',
        id: '123',
      };

      const mockToken = 'mock-jwt-token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({ token: mockToken });
    });
  });

  describe('validateUser', () => {
    it('deve retornar o usuário se as credenciais estiverem corretas', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@example.com',
        isActive: true,
        role: ClientRole.Administrator,
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true);

      const result = await authService.validateUser(loginDto);

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(mockBcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se o usuário não for encontrado', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(null);

      const result = await authService.validateUser(loginDto);

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(result).toBeNull();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@example.com',
        isActive: true,
        role: ClientRole.Administrator,
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false);

      const result = await authService.validateUser(loginDto);

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(mockBcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toBeNull();
    });

    it('deve retornar null se ocorrer um erro durante a comparação de senha', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: '123',
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@example.com',
        isActive: true,
        role: ClientRole.Administrator,
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(mockUser);
      mockBcryptCompare.mockRejectedValue(new Error('Erro na comparação'));

      const result = await authService.validateUser(loginDto);

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    it('deve enviar um e-mail de redefinição de senha se o usuário existir', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'testuser@example.com',
      };

      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        role: ClientRole.Administrator,
        isActive: true,
      };

      const mockRequest: any = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(mockUser);

      await authService.forgotPassword(forgotPasswordDto, mockRequest);

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(resetTokenRepository.create).toHaveBeenCalled();
      expect(resetTokenRepository.save).toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('deve retornar uma mensagem mesmo se o usuário não existir', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      const mockRequest: any = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
      };

      usersService.findOneByUsernameOrEmail.mockResolvedValue(null);

      const result = await authService.forgotPassword(
        forgotPasswordDto,
        mockRequest,
      );

      expect(usersService.findOneByUsernameOrEmail).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(resetTokenRepository.create).not.toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'If this user exists, they will receive an email',
      });
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir a senha do usuário se o token for válido', async () => {
      const resetPasswordDto = {
        resetToken: 'valid-token',
        password: 'newpassword123',
      };

      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
      };

      const mockToken = {
        token: 'valid-token',
        expiryDate: new Date(Date.now() + 3600000),
        user: mockUser,
      };

      resetTokenRepository.findOne.mockResolvedValue(mockToken);

      const mockUpdatePassword = jest.fn().mockResolvedValue(mockUser);
      usersService.updatePassword = mockUpdatePassword;

      await authService.resetPassword(resetPasswordDto);

      expect(resetTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          token: resetPasswordDto.resetToken,
          expiryDate: expect.anything(),
        },
        relations: ['user'],
      });
      expect(mockUpdatePassword).toHaveBeenCalledWith(
        mockUser.id,
        resetPasswordDto.password,
      );
    });

    it('deve lançar uma exceção se o token for inválido', async () => {
      const resetPasswordDto = {
        resetToken: 'invalid-token',
        password: 'newpassword123',
      };

      resetTokenRepository.findOne.mockResolvedValue(null);

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Invalid link',
      );

      expect(resetTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          token: resetPasswordDto.resetToken,
          expiryDate: expect.anything(),
        },
        relations: ['user'],
      });
    });
  });
});
