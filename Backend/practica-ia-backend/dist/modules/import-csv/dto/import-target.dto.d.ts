export declare enum ImportTarget {
    CURSO = "curso",
    CARRERA = "carrera",
    PENSUM = "pensum",
    CURSO_PRERREQUISITO = "curso_prerrequisito",
    HISTORIAL_ACADEMICO = "historial_academico",
    ESTUDIANTE = "estudiante"
}
export declare const IMPORT_TARGET_ROUTE_VALUES: string[];
export declare function normalizeImportTarget(value: string): ImportTarget | undefined;
export declare class ImportTargetParamDto {
    target: string;
}
