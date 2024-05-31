import { Module } from '@nestjs/common';
import { LoggerService } from '../service/LoggerService';

@Module({
  providers: [LoggerService],
  exports: [LoggerService]
})
export class MyLoggerModule {}