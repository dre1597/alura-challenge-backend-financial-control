import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';
import { AddRevenueDto } from './dto';

import { RevenuesService } from './revenues.service';

@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @Get()
  listRevenues(): PrismaPromise<Revenues[]> {
    return this.revenuesService.listRevenues();
  }

  @Post()
  addRevenue(@Body() revenueData: AddRevenueDto): Promise<Revenues> {
    return this.revenuesService.addRevenue(revenueData);
  }
}
