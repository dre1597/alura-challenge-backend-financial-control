import { ForbiddenException, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../orm/prisma/prisma.service';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils';
import { AddExpenseDto } from './dto';

@Injectable()
export class ExpensesService {
  private _logger: Logger = new Logger('ExpensesService');

  constructor(private prisma: PrismaService) {}

  async addExpense(expenseData: AddExpenseDto) {
    const { description, date, value } = expenseData;

    this._logger.debug(`Checking if the description is valid.`);
    const isDescriptionValid: boolean = await this._validateDescription(description, date);

    if (!isDescriptionValid) {
      this._logger.error(`Invalid description.`);
      throw new ForbiddenException('Invalid description.');
    }

    this._logger.debug('Adding a new expense.');
    const expense = await this.prisma.expenses.create({
      data: {
        description,
        value,
        date: date ? new Date(date) : new Date(),
      },
    });

    this._logger.log(`A expense with id ${expense.id} was added.`);
  }

  private async _validateDescription(description: string, date: string): Promise<boolean> {
    if (!date) {
      date = getDateStringNow();
    }

    return this._findIfDescriptionIsUniqueOnTheMonth(description, date);
  }

  private async _findIfDescriptionIsUniqueOnTheMonth(
    description: string,
    date: string,
  ): Promise<boolean> {
    const firstDayOfTheMonth = getFirstDayOfMonth(date);
    const lastDayOfTheMonth = getLastDayOfMonth(date);

    const dateFound = await this.prisma.expenses.findFirst({
      where: {
        description,
        date: {
          lte: lastDayOfTheMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });

    return dateFound ? false : true;
  }
}
