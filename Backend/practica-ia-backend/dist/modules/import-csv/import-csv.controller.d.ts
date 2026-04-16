import { ImportCsvService } from './import-csv.service';
import { ImportResultDto } from './dto/import-result.dto';
import { ImportTargetParamDto } from './dto/import-target.dto';
export declare class ImportCsvController {
    private readonly importCsvService;
    constructor(importCsvService: ImportCsvService);
    import(params: ImportTargetParamDto, file: {
        buffer: Buffer;
    } | undefined): Promise<ImportResultDto>;
}
