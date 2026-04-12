import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private configService: ConfigService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      if (this.dataSource.isInitialized) {
        this.logger.log('✅ Connection to PostgreSQL database established successfully!');
      }
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL database', error);
      throw error;
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
