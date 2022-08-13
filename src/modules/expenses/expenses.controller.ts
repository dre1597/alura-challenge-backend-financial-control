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

import { Month } from '../../utils/enum';
import { AddExpenseDto, FilterExpensesDto, UpdateExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  listExpenses(@Query() filterExpensesDto: FilterExpensesDto): PrismaPromise<Expenses[]> {
    return this.expensesService.listExpenses(filterExpensesDto);
  }

  @Post()
  addExpense(@Body() expenseData: AddExpenseDto): Promise<void> {
    return this.expensesService.addExpense(expenseData);
  }

  @Get(':id')
  getExpense(@Param('id') id: string): Promise<Expenses> {
    return this.expensesService.getExpense(id);
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
  listExpensesByYearMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', new ParseEnumPipe(Month)) month: Month,
  ): PrismaPromise<Expenses[]> {
    return this.expensesService.listExpensesByYearMonth(year, month);
  }
}
