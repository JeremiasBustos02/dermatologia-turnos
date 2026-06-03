import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FilterUsersDto } from './dto/FilterUsersDto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }

  async findAll(filters: FilterUsersDto) {
    return this.prisma.user.findMany({
      where: {
        dni: filters.dni,
        email: filters.email,
        role: filters.role,

        firstName: filters.firstName
          ? {
            contains: filters.firstName,
            mode: 'insensitive',
          }
          : undefined,

        lastName: filters.lastName
          ? {
            contains: filters.lastName,
            mode: 'insensitive',
          }
          : undefined,
      },

      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `No existe un usuario con ID ${id}`,
      );
    }

    return user;
  }

  update(id: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByDni(dni: string) {
    const user = await this.prisma.user.findUnique({
      where: { dni },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `No existe un usuario con DNI ${dni}`,
      );
    }

    return user;
  }

  async findByDniForAuth(dni: string) {
    return this.prisma.user.findUnique({
      where: { dni },
    });
  }
}