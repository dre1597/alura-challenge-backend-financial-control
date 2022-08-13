import { Body, Controller, Post } from '@nestjs/common';

import { AddExpenseDto } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  addExpense(@Body() expenseData: AddExpenseDto): Promise<void> {
    return this.expensesService.addExpense(expenseData);
  }
}
