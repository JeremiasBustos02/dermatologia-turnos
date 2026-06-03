import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    switch (exception.code) {
      /**
       * Unique constraint failed
       * Ej: email duplicado
       */
      case 'P2002': {
        const target = exception.meta?.target as string[] | string;

        const field = Array.isArray(target)
          ? target.join(', ')
          : target;

        throw new ConflictException(
          `Ya existe un registro con ${field}`,
        );
      }

      /**
       * Foreign key constraint failed
       * Ej: eliminar profesional con turnos
       */
      case 'P2003':
        throw new BadRequestException(
          'La operación no es válida porque está relacionada con otros registros',
        );

      /**
       * Record not found
       */
      case 'P2025':
        throw new NotFoundException(
          'El registro no existe',
        );

      default:
        throw new InternalServerErrorException(
          'Error inesperado en la base de datos',
        );
    }
  }
}