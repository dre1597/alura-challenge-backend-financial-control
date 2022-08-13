import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';

import { PrismaService } from '../../orm/prisma/prisma.service';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils';
import { Month } from '../../utils/enum';
import { AddRevenueDto, FilterRevenuesDto, UpdateRevenueDto } from './dto';

@Injectable()
export class RevenuesService {
  private _logger: Logger = new Logger('RevenuesService');

  constructor(private readonly prismaService: PrismaService) {}

  listRevenues(findRevenuesDto: FilterRevenuesDto): PrismaPromise<Revenues[]> {
    const { description } = findRevenuesDto;

    if (description) {
      this._logger.debug('Finding all the revenues with filter');

      return this.prismaService.revenues.findMany({
        where: {
          description,
        },
      });
    }

    this._logger.debug('Finding all the revenues.');

    return this.prismaService.revenues.findMany();
  }

  async addRevenue(addRevenueDto: AddRevenueDto): Promise<void> {
    const { description, date, value } = addRevenueDto;

    this._logger.debug(`Checking if the description is valid.`);
    const isDescriptionValid: boolean = await this._validateDescription(description, date);

    if (!isDescriptionValid) {
      this._logger.error(`Invalid description.`);
      throw new ForbiddenException('Invalid description.');
    }

    this._logger.debug('Adding a new revenue.');
    const revenue = await this.prismaService.revenues.create({
      data: {
        description,
        value,
        date: date ? new Date(date) : new Date(),
      },
    });

    this._logger.log(`A revenue with id ${revenue.id} was added.`);
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

    const revenueFound = await this.prismaService.revenues.findFirst({
      where: {
        description,
        date: {
          lte: lastDayOfTheMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });

    return revenueFound ? false : true;
  }

  async getRevenue(id: string): Promise<Revenues> {
    this._logger.debug(`Searching for a revenue with id ${id}`);
    const revenue = await this.prismaService.revenues.findUnique({
      where: { id },
    });

    if (!revenue) {
      this._logger.error(`Revenue ${id} not found.`);
      throw new NotFoundException('Revenue not found.');
    }

    return revenue;
  }

  async updateRevenue(id: string, updateRevenueDto: UpdateRevenueDto): Promise<void> {
    const { description, date, value } = updateRevenueDto;

    this._logger.debug(`Searching for a revenue with id ${id} `);

    const revenueFound = await this.getRevenue(id);

    if (description && description !== revenueFound.description) {
      this._logger.debug(`Checking if the description is valid.`);
      const isDescriptionValid: boolean = await this._validateDescription(description, date);

      if (!isDescriptionValid) {
        this._logger.error(`Invalid description.`);
        throw new ForbiddenException('Invalid description.');
      }
    }

    this._logger.debug(`Updating a revenue with id ${id}`);

    await this.prismaService.revenues.update({
      where: {
        id,
      },
      data: {
        description,
        value,
        date,
      },
    });

    this._logger.log(`A revenue with id ${id} was updated.`);
  }

  async deleteRevenue(id: string): Promise<void> {
    this._logger.debug(`Searching for a revenue with id ${id} `);

    await this.getRevenue(id);

    this._logger.debug(`Deleting a revenue with id ${id}`);

    await this.prismaService.revenues.delete({
      where: {
        id,
      },
    });

    this._logger.log(`A revenue with id ${id} was deleted.`);
  }

  listRevenuesByYearMonth(year: number, month: Month): PrismaPromise<Revenues[]> {
    this._logger.debug(`Looking for the first day of the month ${month} on year ${year}`);
    const firstDayOfTheMonth = new Date(year, +Month[month]);

    this._logger.debug(`Looking for the first day of the next month of ${month} on year ${year}`);
    const firstDayOfTheNextMonth = new Date(year, +Month[month] + 1);

    this._logger.debug(`Searching for the revenues on this year ${year} and month ${month}`);

    return this.prismaService.revenues.findMany({
      where: {
        date: {
          lte: firstDayOfTheNextMonth,
          gte: firstDayOfTheMonth,
        },
      },
    });
  }
}
