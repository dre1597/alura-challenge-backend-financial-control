import { MappedTotalExpensesByCategory } from '../../../modules/expenses/type';

export interface SummaryByYearMonthRO {
  totalRevenues: number;
  totalExpenses: number;
  balance: number;
  totalExpensesByCategory: MappedTotalExpensesByCategory;
}
