import { BadRequestException, Injectable, ParseIntPipe, type ArgumentMetadata, type PipeTransform } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, Promise<number>> {
  private readonly parseIntPipe = new ParseIntPipe({ errorHttpStatusCode: 400 });

  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const parsed = await this.parseIntPipe.transform(value, metadata);

    if (parsed <= 0) {
      throw new BadRequestException('El ID debe ser un número positivo.');
    }

    return parsed;
  }
}
