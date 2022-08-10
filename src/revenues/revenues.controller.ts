import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';

import { AddRevenueDto } from './dto';
import { FindOneParams } from './params';
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

  @Get(':id')
  listOneRevenue(@Param() params: FindOneParams): PrismaPromise<Revenues> {
    const { id } = params;

    return this.revenuesService.listOneRevenue(id);
  }
}
