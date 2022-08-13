import { Body, Controller, Get, Post } from '@nestjs/common';
import { Expenses, PrismaPromise } from '@prisma/client';

import { AddExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  listRevenues(): PrismaPromise<Expenses[]> {
    return this.expensesService.listExpenses();
  }

  @Post()
  addExpense(@Body() expenseData: AddExpenseDto): Promise<void> {
    return this.expensesService.addExpense(expenseData);
  }
}
