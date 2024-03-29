import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Expenses, PrismaPromise } from '@prisma/client';

import { PrismaService } from '../../orm/prisma/prisma.service';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils';
import { Month } from '../../utils/enum';
import { AddExpenseDto, FilterExpensesDto, UpdateExpenseDto } from './dto';
import { Category } from './enum';
import { MappedTotalExpensesByCategory, TotalExpensesByCategory } from './type';

@Injectable()
export class ExpensesService {
  private _logger: Logger = new Logger('ExpensesService');

  constructor(private readonly prismaService: PrismaService) {}

  listExpenses(filterExpensesDto: FilterExpensesDto): PrismaPromise<Expenses[]> {
    const { description } = filterExpensesDto;

    if (description) {
      this._logger.debug('Finding all the expenses with filter');

      return this.prismaService.expenses.findMany({
        where: {
          description,
        },
      });
    }

    this._logger.debug('Finding all the expenses.');

    return this.prismaService.expenses.findMany();
  }

  async addExpense(expenseData: AddExpenseDto): Promise<void> {
    const { description, date, value, category } = expenseData;

    this._logger.debug(`Checking if the description is valid.`);
    const isDescriptionValid: boolean = await this._validateDescription(description, date);

    if (!isDescriptionValid) {
      this._logger.error(`Invalid description.`);
      throw new ForbiddenException('Invalid description.');
    }

    this._logger.debug('Adding a new expense.');
    const expense = await this.prismaService.expenses.create({
      data: {
        description,
        value,
        date: date ? new Date(date) : new Date(),
        category: category ? category : Category.OTHERS,
      },
    });

    this._logger.log(`A expense with id ${expense.id} was added.`);
  }

  async getExpense(id: string): Promise<Expenses> {
    this._logger.debug(`Searching for a expense with id ${id}`);
    const expense = await this.prismaService.expenses.findUnique({
      where: { id },
    });

    if (!expense) {
      this._logger.error(`Expense ${id} not found.`);
      throw new NotFoundException('Expense not found.');
    }

    return expense;
  }

  async updateExpense(id: string, expenseData: UpdateExpenseDto): Promise<void> {
    const { description, date, value } = expenseData;

    this._logger.debug(`Searching for a expense with id ${id} `);

    const expenseFound = await this.getExpense(id);

    if (description && description !== expenseFound.description) {
      this._logger.debug(`Checking if the description is valid.`);
      const isDescriptionValid: boolean = await this._validateDescription(description, date);

      if (!isDescriptionValid) {
        this._logger.error(`Invalid description.`);
        throw new ForbiddenException('Invalid description.');
      }
    }

    this._logger.debug(`Updating a expense with id ${id}`);

    await this.prismaService.expenses.update({
      where: {
        id,
      },
      data: {
        description,
        value,
        date,
      },
    });

    this._logger.log(`A expense with id ${id} was updated.`);
  }

  async deleteExpense(id: string): Promise<void> {
    this._logger.debug(`Searching for a expense with id ${id} `);

    await this.getExpense(id);

    this._logger.debug(`Deleting a expense with id ${id}`);

    await this.prismaService.expenses.delete({
      where: {
        id,
      },
    });

    this._logger.log(`A expense with id ${id} was deleted.`);
  }

  listExpensesByYearMonth(year: number, month: Month): PrismaPromise<Expenses[]> {
    this._logger.debug(`Looking for the first day of the month ${month} on year ${year}`);
    const firstDayOfTheMonth = new Date(year, +Month[month]);

    this._logger.debug(`Looking for the first day of the next month of ${month} on year ${year}`);
    const firstDayOfTheNextMonth = new Date(year, +Month[month] + 1);

    this._logger.debug(`Searching for the expenses on this year ${year} and month ${month}`);

    return this.prismaService.expenses.findMany({
      where: {
        date: {
          lte: firstDayOfTheNextMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });
  }

  async getExpensesTotalValueByYearMonth(year: number, month: Month): Promise<number> {
    const expenses = await this.listExpensesByYearMonth(year, month);

    return expenses.reduce((acc, curr) => acc + curr.value, 0);
  }

  async getTotalExpensesSummaryByCategory(
    year: number,
    month: Month,
  ): Promise<MappedTotalExpensesByCategory> {
    const categories = Object.values(Category);

    const expenses = await this.listExpensesByYearMonth(year, month);

    const summary = categories.map((category) => {
      return {
        [category]: expenses
          .filter((expense) => expense.category === category)
          .reduce((acc, curr) => acc + curr.value, 0),
      };
    });

    return this._formatSummary(summary);
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

    const expenseFund = await this.prismaService.expenses.findFirst({
      where: {
        description,
        date: {
          lte: lastDayOfTheMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });

    return !expenseFund;
  }

  private _formatSummary(summary: TotalExpensesByCategory): MappedTotalExpensesByCategory {
    const summaryFormatted = {} as MappedTotalExpensesByCategory;

    for (const elem of summary) {
      summaryFormatted[Object.keys(elem)[0]] = Object.values(elem)[0];
    }

    return summaryFormatted;
  }
}
