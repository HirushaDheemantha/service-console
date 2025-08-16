import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

 async enableShutdownHooks(app: INestApplication) {
  // Disable type checking on $on using "as unknown as"
  (this.$on as unknown as (event: string, cb: () => void) => void)(
    'beforeExit',
    async () => {
      await app.close();
    }
  );
}
}
