import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe } from '@nestjs/common';

import { Month } from '../../utils/enum';
import { SummaryByYearMonthRO } from './interface';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':year/:month')
  summaryByYearMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', new ParseEnumPipe(Month)) month: Month,
  ): Promise<SummaryByYearMonthRO> {
    return this.summaryService.summaryByYearMonth(year, month);
  }
}
