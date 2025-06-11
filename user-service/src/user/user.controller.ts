import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserIdDto, UserQueryDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userData: UserDto) {
    return this.userService.create(userData);
  }

  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query.page, query.limit);
  }

  @Get(':id')
  findOne(@Param() params: UserIdDto) {
    return this.userService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UserIdDto, @Body() userData: UserDto) {
    return this.userService.update(params.id, userData);
  }

  @Delete(':id')
  remove(@Param() params: UserIdDto) {
    return this.userService.remove(params.id);
  }
}
