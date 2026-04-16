import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
export declare class DatabaseService implements OnModuleInit {
    private configService;
    private dataSource;
    private readonly logger;
    constructor(configService: ConfigService, dataSource: DataSource);
    onModuleInit(): Promise<void>;
    getDataSource(): DataSource;
}
