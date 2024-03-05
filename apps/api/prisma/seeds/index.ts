import { join } from 'path';
import prisma from '../client';

async function main() {
  try {
    console.log('start seeding...');
    //   const conditionsFile = join(process.cwd(), '/files/conditions.csv');
    //   console.log(conditionsFile);

    //   const conditionsSeed = await prisma.$queryRaw`
    //   COPY "conditions"(name, diagnostic_metrics)
    //   FROM ${conditionsFile}
    //   DELIMITER ','
    //   CSV HEADER;
    // `;

    //   const [conditions] = await Promise.all([conditionsSeed]);
    //   console.log(conditions);
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
