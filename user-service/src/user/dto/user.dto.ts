import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(320)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(320)
  email: string;
}

export class UserIdDto {
  @IsMongoId()
  @IsString()
  @Length(24)
  id: string;
}

export class UserQueryDto {
  @Type(() => Number)
  @Min(1)
  page: number;
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number;
}
