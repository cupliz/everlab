import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '.prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('connect db...');
    await this.$connect();
  }
  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     console.log('PrismaService enableShutdownHooks beforeExit');
  //     await app.close();
  //   });
  // }
}
