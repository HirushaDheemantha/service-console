import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [PrismaModule, ServicesModule, ClientsModule],
})
export class AppModule {}