import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ClientRole } from './enums/role.enum';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    getProfile: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const mockUser: User = {
        id: '10',
        username: 'user',
        email: 'user@gmail.com',
        password: 'hashedpassword123',
        role: ClientRole.ProductionOperator,
        isActive: true,
      };

      const result = controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
  describe('update', () => {
    it('should call the update service method with the correct data', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'new_username',
        email: 'new_email@gmail.com',
        role: ClientRole.ProductionOperator,
      };

      mockUsersService.update.mockResolvedValue(undefined);

      await controller.update(updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(updateUserDto);
    });
  });
});
