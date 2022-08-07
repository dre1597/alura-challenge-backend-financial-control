import { Body, Controller, Get, Post } from '@nestjs/common';

import { RevenuesService } from './revenues.service';

@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @Get()
  listRevenues() {
    return this.revenuesService.listRevenues();
  }

  @Post()
  addRevenue(
    @Body()
    revenueData: {
      description: string;
      value: number;
      date?: Date;
    },
  ) {
    return this.revenuesService.addRevenue(revenueData);
  }
}
