import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserDto } from './dto/user.dto';
import { RabbitMQSession } from 'src/messsaging/rabbitmq-client.provider';

@Injectable()
export class UserService implements OnModuleDestroy {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(RabbitMQSession) private RabbitMQSession: RabbitMQSession,
  ) {}

  async create(userData: UserDto) {
    try {
      const createdUser = await this.userModel.create(userData);
      this.RabbitMQSession.client.emit('user_created', createdUser);
      this.logger.debug('User created', createdUser);
      return createdUser;
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate email
        throw new ConflictException('Email already exists');
      } else if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(err, 'Could not create user');
    }
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return {
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, userData: UserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.debug('User updated', user);
    return user;
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (!deletedUser) throw new NotFoundException('User not found');

      this.RabbitMQSession.client.emit('user_deleted', deletedUser);
      this.logger.debug('User deleted', deletedUser);
      return deletedUser;
    } catch (err) {
      throw new InternalServerErrorException(err, 'Could not delete user');
    }
  }

  onModuleDestroy() {
    this.RabbitMQSession.client.close();
  }
}
