import { IsString, IsOptional, MinLength } from "class-validator";

export class UpdateProjectDto {
    @IsOptional()
    @IsString({
        message: 'El nombre del proyecto debe ser una cadena de texto'
    })
    @MinLength(3, {
        message: 'El nombre del proyecto debe tener al menos 3 caracteres'
    })
    name?: string;
}
