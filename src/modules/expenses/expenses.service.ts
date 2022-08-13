import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Expenses, PrismaPromise } from '@prisma/client';

import { PrismaService } from '../../orm/prisma/prisma.service';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils';
import { Month } from '../../utils/enum';
import { AddExpenseDto, FindExpensesDto, UpdateExpenseDto } from './dto';
import { Category } from './enum';

@Injectable()
export class ExpensesService {
  private _logger: Logger = new Logger('ExpensesService');

  constructor(private prisma: PrismaService) {}

  listExpenses(findExpensesDto: FindExpensesDto): PrismaPromise<Expenses[]> {
    const { description } = findExpensesDto;

    if (description) {
      this._logger.debug('Finding all the expenses with filter');

      return this.prisma.expenses.findMany({
        where: {
          description,
        },
      });
    }

    this._logger.debug('Finding all the expenses.');

    return this.prisma.expenses.findMany();
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
    const expense = await this.prisma.expenses.create({
      data: {
        description,
        value,
        date: date ? new Date(date) : new Date(),
        category: category ? category : Category.OTHERS,
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

    const expenseFund = await this.prisma.expenses.findFirst({
      where: {
        description,
        date: {
          lte: lastDayOfTheMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });

    return expenseFund ? false : true;
  }

  async listOneExpense(id: string): Promise<Expenses> {
    this._logger.debug(`Searching for a expense with id ${id}`);
    const expense = await this.prisma.expenses.findUnique({
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

    const expenseFound = await this.prisma.expenses.findUnique({
      where: {
        id,
      },
    });

    if (!expenseFound) {
      this._logger.error(`Expense ${id} not found.`);
      throw new NotFoundException('Expense not found.');
    }

    if (description && description !== expenseFound.description) {
      this._logger.debug(`Checking if the description is valid.`);
      const isDescriptionValid: boolean = await this._validateDescription(description, date);

      if (!isDescriptionValid) {
        this._logger.error(`Invalid description.`);
        throw new ForbiddenException('Invalid description.');
      }
    }

    this._logger.debug(`Updating a expense with id ${id}`);

    await this.prisma.expenses.update({
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

    const expenseFound = await this.prisma.expenses.findUnique({
      where: {
        id,
      },
    });

    if (!expenseFound) {
      this._logger.error(`Expense ${id} not found.`);
      throw new NotFoundException('Expense not found.');
    }

    this._logger.debug(`Deleting a expense with id ${id}`);

    await this.prisma.expenses.delete({
      where: {
        id,
      },
    });

    this._logger.log(`A expense with id ${id} was deleted.`);
  }

  listAllExpensesByMonth(year: number, month: Month): PrismaPromise<Expenses[]> {
    const firstDayOfTheMonth = new Date(year, +Month[month]);

    const firstDayOfTheNextMonth = new Date(year, +Month[month] + 1);

    return this.prisma.expenses.findMany({
      where: {
        date: {
          lte: firstDayOfTheNextMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });
  }
}
