import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from './user.schema';

//            ----------------------------  RESEARCH ```mongodb-memory-server``` FOR MOCK DATABASE TESTING PURPOSES ----------------------------

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let fakeHeader: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZSI6IjAiLCJpYXQiOjE2OTYyMzI1MjAsImV4cCI6MTY5NjMxODkyMH0.Nb0IbuBZVtUh8KvyUzXYwcj959isOm6hRT2NE2atAmM";
  //let fakeToken = atob(fakeHeader.split('.')[1]);

  beforeEach(async () => {
    fakeUsersService = {
    }

    fakeAuthService = {

    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- 7 test cases ---
  // Creating User
  it(" ", async () => {

  });

  // Getting Users
  it("getUser should return a user given an id.", async () => {
    const user = await controller.getUser("1",fakeHeader);
  });

  // Updating Users

  // Resetting User Passwords

  // Deleting Users
});
