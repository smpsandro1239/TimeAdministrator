import { Global, Module } from '@nestjs/common';
import { Logger } from './logger/logger.service';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class CommonModule {}