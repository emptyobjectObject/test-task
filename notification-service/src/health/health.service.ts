import { Injectable, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @HealthCheck()
  async check() {
    const healthCheckResult = await this.health.check([
      async () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
            queue: 'user_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
    ]);
    this.logger.log(healthCheckResult);
    return healthCheckResult;
  }
}
