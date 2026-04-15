import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre es requerido',
  })
  @MinLength(3, {
    message: 'El nombre debe tener al menos 3 caracteres',
  })
  name: string;
}
