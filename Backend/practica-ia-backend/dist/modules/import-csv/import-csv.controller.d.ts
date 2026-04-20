import { ImportCsvService } from './import-csv.service';
import { ImportResultDto } from './dto/import-result.dto';
import { ImportTargetParamDto } from './dto/import-target.dto';
type UploadedCsvFields = {
    file?: Array<{
        buffer: Buffer;
    }>;
    archivo?: Array<{
        buffer: Buffer;
    }>;
    csv?: Array<{
        buffer: Buffer;
    }>;
};
export declare class ImportCsvController {
    private readonly importCsvService;
    constructor(importCsvService: ImportCsvService);
    import(params: ImportTargetParamDto, files: UploadedCsvFields): Promise<ImportResultDto>;
}
export {};
