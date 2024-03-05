import { DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

export const config: any = {
  app: { logger: ['error', 'warn'] },
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  },
  supabase: {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
};

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE: {
    API_URL: process.env.SUPABASE_API_URL,
    DB_URL: process.env.SUPABASE_DB_URL,
    DIRECT_URL: process.env.SUPABASE_DIRECT_URL,
    ANON_KEY: process.env.SUPABASE_ANON_KEY,
    JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
  },
  RESEND: {
    API_KEY: process.env.RESEND_API_KEY,
  },
};

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Docs')
  .setDescription('Api Docs for Everlab')
  .setVersion('1.0')
  .build();
