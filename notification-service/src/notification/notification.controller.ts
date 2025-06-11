import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    this.logger.log(`User created: ${JSON.stringify(data)}`);
  }

  @EventPattern('user_deleted')
  handleUserDeleted(@Payload() data: any) {
    this.logger.log(`User deleted: ${JSON.stringify(data)}`);
  }
}
