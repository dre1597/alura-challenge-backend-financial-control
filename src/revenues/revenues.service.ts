import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from 'src/utils';

import { PrismaService } from '../prisma/prisma.service';
import { AddRevenueDto } from './dto';

@Injectable()
export class RevenuesService {
  private _logger: Logger = new Logger('RevenuesService');

  constructor(private prisma: PrismaService) {}

  listRevenues(): PrismaPromise<Revenues[]> {
    this._logger.debug('Finding all the revenues.');
    return this.prisma.revenues.findMany();
  }

  async addRevenue(revenueData: AddRevenueDto): Promise<Revenues> {
    const { description, date, value } = revenueData;

    this._logger.debug(`Checking if the description is valid.`);
    const isDescriptionValid: boolean = await this._validateDescription(description, date);

    if (!isDescriptionValid) {
      this._logger.error(`Invalid description.`);
      throw new ForbiddenException('Invalid description.');
    }

    this._logger.debug('Adding a new revenue.');
    const revenue = await this.prisma.revenues.create({
      data: {
        description,
        value,
        date: date ? new Date(date) : new Date(),
      },
    });

    this._logger.log(`A revenue with id ${revenue.id} was added.`);

    return revenue;
  }

  private async _validateDescription(description: string, date: string): Promise<boolean> {
    if (!date) {
      date = getDateStringNow();
    }

    return this._findIfDescriptionIsUniqueOnTheMonth(description, date);
  }

  private async _findIfDescriptionIsUniqueOnTheMonth(
    description: string,
    date: string,
  ): Promise<boolean> {
    const firstDayOfTheMonth = getFirstDayOfMonth(date);
    const lastDayOfTheMonth = getLastDayOfMonth(date);

    const dateFound = await this.prisma.revenues.findFirst({
      where: {
        description,
        date: {
          lte: lastDayOfTheMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });

    return dateFound ? false : true;
  }
}
