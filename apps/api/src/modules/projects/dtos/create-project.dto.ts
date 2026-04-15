import { IsString, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString({
        message: 'El nombre del proyecto debe ser una cadena de texto'
    })
    @MinLength(3, {
        message: 'El nombre del proyecto debe tener al menos 3 caracteres'
    })
    name: string;
}