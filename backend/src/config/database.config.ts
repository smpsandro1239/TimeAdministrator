import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/timeadministrator');
  console.log('Connecting to MongoDB:', uri);

  return {
    uri,
    retryWrites: true,
  };
};