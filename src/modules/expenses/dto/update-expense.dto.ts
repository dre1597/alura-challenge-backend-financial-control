import { PartialType } from '@nestjs/mapped-types';

import { AddExpenseDto } from './add-expense.dto';

export class UpdateExpenseDto extends PartialType(AddExpenseDto) {}
