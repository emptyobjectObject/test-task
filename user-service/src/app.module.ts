import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://app_user:app_password@mongo:27017/admin',
    ),
    UserModule,
    HealthModule,
  ],
})
export class AppModule {}
