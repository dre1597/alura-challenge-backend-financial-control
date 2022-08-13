import { Module } from '@nestjs/common';

import { RevenuesController } from './revenues.controller';
import { RevenuesService } from './revenues.service';

@Module({
  imports: [],
  controllers: [RevenuesController],
  providers: [RevenuesService],
})
export class RevenuesModule {}
