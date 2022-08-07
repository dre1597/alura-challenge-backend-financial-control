import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RevenuesModule } from './revenues/revenues.module';

@Module({
  imports: [RevenuesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
