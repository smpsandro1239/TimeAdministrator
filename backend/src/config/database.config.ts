import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

// src/config/database.config.ts
export const databaseConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGODB_URI');
  console.log('>>> MONGODB_URI raw value:', JSON.stringify(uri));
  console.log('>>> Type of MONGODB_URI:', typeof uri);
  return {
    uri,
    retryWrites: true,
  };
};
