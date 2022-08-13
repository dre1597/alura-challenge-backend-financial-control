import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Expenses, PrismaPromise } from '@prisma/client';
import { Month } from 'src/utils/enum';

import { AddExpenseDto, FindExpensesDto, UpdateExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  listExpenses(@Query() findExpensesDto: FindExpensesDto): PrismaPromise<Expenses[]> {
    return this.expensesService.listExpenses(findExpensesDto);
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

  @Get(':year/:month')
  listAllExpensesByMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', new ParseEnumPipe(Month)) month: Month,
  ): PrismaPromise<Expenses[]> {
    return this.expensesService.listAllExpensesByMonth(year, month);
  }
}
