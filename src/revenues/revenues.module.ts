import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RevenuesController } from './revenues.controller';
import { RevenuesService } from './revenues.service';

@Module({
  imports: [],
  controllers: [RevenuesController],
  providers: [RevenuesService, PrismaService],
})
export class RevenuesModule {}
