import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RevenuesService {
  constructor(private prisma: PrismaService) {}

  listRevenues() {
    return this.prisma.revenues.findMany();
  }

  addRevenue(revenueData: { description: string; value: number; date?: Date }) {
    return this.prisma.revenues.create({
      data: revenueData,
    });
  }
}
