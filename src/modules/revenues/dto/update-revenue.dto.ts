import { PartialType } from '@nestjs/mapped-types';

import { AddRevenueDto } from './add-revenue.dto';

export class UpdateRevenueDto extends PartialType(AddRevenueDto) {}
