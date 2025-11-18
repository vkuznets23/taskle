import { PrismaClient as OriginalPrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock =
  mockDeep<OriginalPrismaClient>() as DeepMockProxy<OriginalPrismaClient>

export default class PrismaClient {
  constructor() {
    return prismaMock
  }
}
