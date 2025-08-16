import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  create(data: Client): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  update(id: number, data: Partial<Client>): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data });
  }

  delete(id: number): Promise<Client> {
    return this.prisma.client.delete({ where: { id } });
  }
}
