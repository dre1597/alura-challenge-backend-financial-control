import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Expenses, PrismaPromise } from '@prisma/client';

import { AddExpenseDto, UpdateExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  listExpenses(): PrismaPromise<Expenses[]> {
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

  @Patch(':id')
  updateExpense(@Param('id') id: string, @Body() expenseData: UpdateExpenseDto): Promise<void> {
    return this.expensesService.updateExpense(id, expenseData);
  }

  @Delete(':id')
  deleteExpense(@Param('id') id: string): Promise<void> {
    return this.expensesService.deleteExpense(id);
  }
}
