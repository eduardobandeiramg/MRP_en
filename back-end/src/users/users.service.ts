import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  }

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, password, role } = createUserDto;
    await this.validateUser(username, email);

    const hashPassword = await this.createHashPassword(password);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashPassword,
      role,
      isActive: true,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async validateUser(username: string, email: string): Promise<void> {
    const existingUserByUsername =
      await this.findOneByUsernameOrEmail(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username já está em uso.');
    }

    const existingUserByEmail = await this.findOneByUsernameOrEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email já está em uso.');
    }
  }

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async updatePassword(
    id: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    const hashPassword = await this.createHashPassword(password);
    user.password = hashPassword;
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  async update(newUser: UpdateUserDto): Promise<void> {
    const checkExistUser = await this.findOneByUsernameOrEmail(newUser.email);

    if (!checkExistUser) {
      throw new ConflictException('Usuário não encontrado.');
    }

    try {
      await this.usersRepository.update(checkExistUser.id, {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar o usuário.');
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  async getAllWithFilters(filters: {
    username?: string;
    email?: string;
    isActive?: string;
  }): Promise<User[]> {
    try {
      const whereConditions: Partial<User> = {};

      if (filters.username) {
        whereConditions.username = filters.username;
      }

      if (filters.email) {
        whereConditions.email = filters.email;
      }

      if (filters.isActive !== undefined) {
        whereConditions.isActive = filters.isActive === '1';
      }

      const users = await this.usersRepository.find({
        where: whereConditions,
      });

      if (!users.length) {
        throw new NotFoundException(
          'Nenhum usuário encontrado com os filtros aplicados.',
        );
      }

      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários com filtros:', error);
      throw new InternalServerErrorException(
        'Erro ao buscar usuários com filtros.',
      );
    }
  }
}
