import { Module } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  controllers: [NotificationController],
  imports: [TerminusModule, HealthModule],
})
export class AppModule {}
