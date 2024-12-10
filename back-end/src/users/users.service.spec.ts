import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ClientRole } from './enums/role.enum';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findOneByUsernameOrEmail: jest.fn(),
    updatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHashPassword', () => {
    it('should generate a hashed password', async () => {
      const plainPassword = 'password123';
      const salt = 'randomSalt';
      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const result = await service.createHashPassword(plainPassword);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, salt);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: ClientRole.ProductionOperator,
    };

    it('should create and save a user successfully', async () => {
      const hashedPassword = 'hashedpassword';
      const mockUser = {
        ...createUserDto,
        password: hashedPassword,
        isActive: true,
      };

      jest
        .spyOn(service, 'createHashPassword')
        .mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(service, 'validateUser').mockResolvedValue(undefined);

      await service.create(createUserDto);

      expect(service.validateUser).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.email,
      );
      expect(service.createHashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
        isActive: true,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if username or email already exists', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new ConflictException('Username já está em uso.'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        createUserDto.username,
        createUserDto.email,
      );
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const hashedPassword = 'hashedpassword';
      const mockUser = {
        ...createUserDto,
        password: hashedPassword,
        isActive: true,
      };

      jest
        .spyOn(service, 'createHashPassword')
        .mockResolvedValue(hashedPassword);
      jest.spyOn(service, 'validateUser').mockResolvedValue(undefined);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('validateUser', () => {
    const username = 'testuser';
    const email = 'testuser@example.com';

    it('should throw ConflictException if username already exists', async () => {
      const mockExistingUser: User = {
        id: '1',
        username,
        email,
        password: 'hashedpassword',
        role: ClientRole.ProductionOperator,
        isActive: true,
      };

      jest
        .spyOn(service, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce(mockExistingUser);

      await expect(service.validateUser(username, email)).rejects.toThrow(
        new ConflictException('Username já está em uso.'),
      );

      expect(service.findOneByUsernameOrEmail).toHaveBeenCalledWith(username);
    });

    it('should throw ConflictException if email already exists', async () => {
      const mockExistingUser: User = {
        id: '2',
        username,
        email,
        password: 'hashedpassword',
        role: ClientRole.ProductionOperator,
        isActive: true,
      };

      jest
        .spyOn(service, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce(null) // Simulando que o username não existe
        .mockResolvedValueOnce(mockExistingUser); // Simulando que o email existe

      await expect(service.validateUser(username, email)).rejects.toThrow(
        new ConflictException('Email já está em uso.'),
      );

      expect(service.findOneByUsernameOrEmail).toHaveBeenCalledWith(username);
      expect(service.findOneByUsernameOrEmail).toHaveBeenCalledWith(email);
    });

    it('should not throw if username and email are available', async () => {
      jest
        .spyOn(service, 'findOneByUsernameOrEmail')
        .mockResolvedValueOnce(null) // Simulando que o username não existe
        .mockResolvedValueOnce(null); // Simulando que o email não existe

      await expect(
        service.validateUser(username, email),
      ).resolves.not.toThrow();

      expect(service.findOneByUsernameOrEmail).toHaveBeenCalledWith(username);
      expect(service.findOneByUsernameOrEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('findOneByUsernameOrEmail', () => {
    it('should return a user if found by username', async () => {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        role: ClientRole.ProductionOperator,
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByUsernameOrEmail('testuser');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'testuser' }, { email: 'testuser' }],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return a user if found by email', async () => {
      const mockUser: User = {
        id: '2',
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'hashedpassword',
        role: ClientRole.InventoryManager,
        isActive: true,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByUsernameOrEmail(
        'testuser2@example.com',
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { username: 'testuser2@example.com' },
          { email: 'testuser2@example.com' },
        ],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if no user is found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByUsernameOrEmail('nonexistentuser');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'nonexistentuser' }, { email: 'nonexistentuser' }],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'oldhashedpassword',
      role: ClientRole.ProductionOperator,
      isActive: true,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update the user password successfully', async () => {
      const newHashedPassword = 'newhashedpassword';

      mockRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(service, 'createHashPassword')
        .mockResolvedValue(newHashedPassword);
      mockRepository.save.mockResolvedValue({
        ...mockUser,
        password: newHashedPassword,
      });

      const result = await service.updatePassword(
        mockUser.id,
        'newpassword123',
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(service.createHashPassword).toHaveBeenCalledWith('newpassword123');
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        password: newHashedPassword,
      });
      expect(result).toEqual({ ...mockUser, password: newHashedPassword });
    });

    it('should throw an error if the user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePassword('nonexistentId', 'newpassword123'),
      ).rejects.toThrowError();

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistentId' },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword',
      role: ClientRole.ProductionOperator,
      isActive: true,
    };

    const updateUserDto = {
      username: 'updateduser',
      email: 'updateduser@example.com',
      role: ClientRole.InventoryManager,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(undefined);

      await service.update(updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { username: updateUserDto.email },
          { email: updateUserDto.email },
        ],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
        username: updateUserDto.username,
        email: updateUserDto.email,
        role: updateUserDto.role,
      });
    });

    it('should throw ConflictException if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(updateUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { username: updateUserDto.email },
          { email: updateUserDto.email },
        ],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.update(updateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { username: updateUserDto.email },
          { email: updateUserDto.email },
        ],
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          role: true,
        },
      });

      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledWith(mockUser.id, {
        username: updateUserDto.username,
        email: updateUserDto.email,
        role: updateUserDto.role,
      });
    });
  });
});
