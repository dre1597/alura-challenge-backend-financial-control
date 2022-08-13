import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  listOneExpense(@Param('id') id: string): Promise<Expenses> {
    return this.expensesService.listOneExpense(id);
  }
}
