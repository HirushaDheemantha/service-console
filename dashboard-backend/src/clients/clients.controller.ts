
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from '@prisma/client';


@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  findAll(): Promise<Client[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: Client): Promise<Client> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Client>): Promise<Client> {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Client> {
    return this.service.delete(+id);
  }
}
