import { IsInt, IsOptional, IsString, Min, IsIn } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    orderBy?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    orderDir?: 'asc' | 'desc' = 'asc';
}
