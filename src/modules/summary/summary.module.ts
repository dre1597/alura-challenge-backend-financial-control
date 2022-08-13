import { Module } from '@nestjs/common';

import { ExpensesModule } from '../expenses/expenses.module';
import { RevenuesModule } from '../revenues/revenues.module';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [ExpensesModule, RevenuesModule],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
