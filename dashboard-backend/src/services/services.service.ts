import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Service } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Service[]> {
    try {
      const services = await this.prisma.service.findMany();
      if (!services || services.length === 0) {
        throw new HttpException('No services found', HttpStatus.NOT_FOUND);
      }
      return services;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error:', error.message);
        throw new HttpException('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw error;
    }
  }

  

  async create(data: Service): Promise<Service> {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new HttpException('Invalid service data', HttpStatus.BAD_REQUEST);
      }
      
      return await this.prisma.service.create({ 
        data: {
          ...data,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
          renewalDate: data.renewalDate ? new Date(data.renewalDate) : new Date(),
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma create error:', error.message);
        if (error.code === 'P2002') {
          throw new HttpException('Service with these details already exists', HttpStatus.CONFLICT);
        }
      }
      throw new HttpException('Failed to create service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: Partial<Service>): Promise<Service> {
    try {
      const existingService = await this.prisma.service.findUnique({ where: { id } });
      if (!existingService) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.service.update({
        where: { id },
        data: {
          ...data,
          ...(data.purchaseDate && { purchaseDate: new Date(data.purchaseDate) }),
          ...(data.renewalDate && { renewalDate: new Date(data.renewalDate) }),
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma update error:', error.message);
      }
      throw new HttpException('Failed to update service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number): Promise<Service> {
    try {
      const existingService = await this.prisma.service.findUnique({ where: { id } });
      if (!existingService) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.service.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma delete error:', error.message);
      }
      throw new HttpException('Failed to delete service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Add initialization method for testing
  async initializeTestData() {
    try {
      const testData = {
        type: 'Hosting',
        name: 'Basic Web Hosting',
        purchasePrice: 100.00,
        renewalPrice: 90.00,
        purchaseDate: new Date(),
        renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'Active'
      };
      
      await this.prisma.service.create({ data: testData });
      console.log('Test service created successfully');
    } catch (error) {
      console.error('Failed to initialize test data:', error);
    }
  }
}