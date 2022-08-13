import { Injectable, Logger } from '@nestjs/common';
import { Expenses, Revenues } from '@prisma/client';

import { Month } from '../../utils/enum';
import { ExpensesService } from '../expenses/expenses.service';
import { RevenuesService } from '../revenues/revenues.service';
import { SummaryByYearMonthRO } from './interface';

@Injectable()
export class SummaryService {
  private _logger: Logger = new Logger('SummaryService');

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly revenuesService: RevenuesService,
  ) {}

  async summaryByYearMonth(year: number, month: Month): Promise<SummaryByYearMonthRO> {
    this._logger.debug(`Searching for the revenues on this year ${year} and month ${month}`);

    const revenues = await this.revenuesService.listRevenuesByYearMonth(year, month);

    const expenses = await this.expensesService.listExpensesByYearMonth(year, month);

    const totalRevenues = this._getRevenuesTotalValue(revenues);
    const totalExpenses = this._getExpensesTotalValue(expenses);

    const balance = totalRevenues - totalExpenses;

    return {
      totalRevenues,
      totalExpenses,
      balance,
    };
  }

  private _getRevenuesTotalValue(revenues: Revenues[]): number {
    return revenues.reduce((acc, curr) => acc + curr.value, 0);
  }

  private _getExpensesTotalValue(expenses: Expenses[]): number {
    return expenses.reduce((acc, curr) => acc + curr.value, 0);
  }
}
