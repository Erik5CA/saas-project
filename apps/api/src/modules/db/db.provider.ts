// src/db/db.module.ts
import { Module, Global } from '@nestjs/common';
import { db } from 'src/db';

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      useValue: db,
    },
  ],
  exports: ['DB'],
})
export class DbModule {}
