import { config } from '../src/config';
import { PrismaClient } from '@prisma/client';

type PrismaService = PrismaClient;

let conn: PrismaService;

if (config.NODE_ENV === 'production') {
  conn = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  conn = global.prisma;
}

export default conn as PrismaService;
