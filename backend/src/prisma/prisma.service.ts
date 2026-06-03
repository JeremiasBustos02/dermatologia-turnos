import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();

    // 1. Guardamos la referencia exacta al cliente base de Prisma
    const client = this;

    return client.$extends({
      query: {
        $allModels: {
          
          async delete({ model, args, query }) {
            const softDeleteModels = ['User', 'Professional', 'Specialty', 'Coverage'];
            if (softDeleteModels.includes(model)) {
              // Transformamos el string 'User' a 'user' para poder llamar a client.user
              const modelName = model.charAt(0).toLowerCase() + model.slice(1);
              return (client as any)[modelName].update({
                ...args,
                data: { deletedAt: new Date() },
              });
            }
            return query(args);
          },

          async deleteMany({ model, args, query }) {
            const softDeleteModels = ['User', 'Professional', 'Specialty', 'Coverage'];
            if (softDeleteModels.includes(model)) {
              const modelName = model.charAt(0).toLowerCase() + model.slice(1);
              return (client as any)[modelName].updateMany({
                ...args,
                data: { deletedAt: new Date() },
              });
            }
            return query(args);
          },

          async findMany({ model, args, query }) {
            const softDeleteModels = ['User', 'Professional', 'Specialty', 'Coverage'];
            if (softDeleteModels.includes(model)) {
              (args as any).where = { ...(args as any).where, deletedAt: null };
            }
            return query(args);
          },

          async findFirst({ model, args, query }) {
            const softDeleteModels = ['User', 'Professional', 'Specialty', 'Coverage'];
            if (softDeleteModels.includes(model)) {
              (args as any).where = { ...(args as any).where, deletedAt: null };
            }
            return query(args);
          },

          async findUnique({ model, args, query }) {
            const softDeleteModels = ['User', 'Professional', 'Specialty', 'Coverage'];
            if (softDeleteModels.includes(model)) {
              // Transformamos el findUnique en un findFirst apuntando directamente al cliente base
              const modelName = model.charAt(0).toLowerCase() + model.slice(1);
              return (client as any)[modelName].findFirst({
                ...args,
                where: { ...(args as any).where, deletedAt: null },
              });
            }
            return query(args);
          },

        },
      },
    }) as unknown as PrismaService;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}