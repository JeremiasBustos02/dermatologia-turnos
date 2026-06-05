import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FilterUsersDto } from './dto/FilterUsersDto';
import { UserRole } from '@prisma/client/index-browser';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    let password = dto.password;

    if (!password && dto.role === UserRole.PATIENT) {
      password = dto.dni;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      }
    });
  }

  async findAll(filters: FilterUsersDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;

    const skip = (page - 1) * limit;

    const whereCondition = {
      dni: queryFilters.dni,
      email: queryFilters.email,
      role: queryFilters.role,
      firstName: queryFilters.firstName
        ? { contains: queryFilters.firstName, mode: 'insensitive' as const }
        : undefined,
      lastName: queryFilters.lastName
        ? { contains: queryFilters.lastName, mode: 'insensitive' as const }
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({ where: whereCondition }),
      this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
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
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: lastPage === 0 ? 1 : lastPage,
      },
    };
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