import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; timestamp: Date } {
    return {
      status: 'healthy',
      timestamp: new Date(),
    };
  }
}
