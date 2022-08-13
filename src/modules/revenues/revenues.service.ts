import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';

import { PrismaService } from '../../orm/prisma/prisma.service';
import { getDateStringNow, getFirstDayOfMonth, getLastDayOfMonth } from '../../utils';
import { AddRevenueDto, FindRevenuesDto, UpdateRevenueDto } from './dto';

@Injectable()
export class RevenuesService {
  private _logger: Logger = new Logger('RevenuesService');

  constructor(private prisma: PrismaService) {}

  listRevenues(findRevenuesDto: FindRevenuesDto): PrismaPromise<Revenues[]> {
    const { description } = findRevenuesDto;

    if (description) {
      this._logger.debug('Finding all the revenues with filter');

      return this.prisma.revenues.findMany({
        where: {
          description,
        },
      });
    }

    this._logger.debug('Finding all the revenues.');

    return this.prisma.revenues.findMany();
  }

  async addRevenue(revenueData: AddRevenueDto): Promise<void> {
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

  async listOneRevenue(id: string): Promise<Revenues> {
    this._logger.debug(`Searching for a revenue with id ${id}`);
    const revenue = await this.prisma.revenues.findUnique({
      where: { id },
    });

    if (!revenue) {
      this._logger.error(`Revenue ${id} not found.`);
      throw new NotFoundException('Revenue not found.');
    }

    return revenue;
  }

  async updateRevenue(id: string, revenueData: UpdateRevenueDto): Promise<void> {
    const { description, date, value } = revenueData;

    this._logger.debug(`Searching for a revenue with id ${id} `);

    const revenueFound = await this.prisma.revenues.findUnique({
      where: {
        id,
      },
    });

    if (!revenueFound) {
      this._logger.error(`Revenue ${id} not found.`);
      throw new NotFoundException('Revenue not found.');
    }

    if (description && description !== revenueFound.description) {
      this._logger.debug(`Checking if the description is valid.`);
      const isDescriptionValid: boolean = await this._validateDescription(description, date);

      if (!isDescriptionValid) {
        this._logger.error(`Invalid description.`);
        throw new ForbiddenException('Invalid description.');
      }
    }

    this._logger.debug(`Updating a revenue with id ${id}`);

    await this.prisma.revenues.update({
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

    const revenueFound = await this.prisma.revenues.findUnique({
      where: {
        id,
      },
    });

    if (!revenueFound) {
      this._logger.error(`Revenue ${id} not found.`);
      throw new NotFoundException('Revenue not found.');
    }

    this._logger.debug(`Deleting a revenue with id ${id}`);

    await this.prisma.revenues.delete({
      where: {
        id,
      },
    });

    this._logger.log(`A revenue with id ${id} was deleted.`);
  }
}
