import { Injectable, Logger } from '@nestjs/common';

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
    this._logger.debug(
      `Searching for the total revenues and total expenses from the year ${year} and the month ${month}`,
    );

    const totalRevenues = await this.revenuesService.getRevenuesTotalValueByYearMonth(year, month);
    const totalExpenses = await this.expensesService.getExpensesTotalValueByYearMonth(year, month);

    const balance = totalRevenues - totalExpenses;

    return {
      totalRevenues,
      totalExpenses,
      balance,
    };
  }
}
