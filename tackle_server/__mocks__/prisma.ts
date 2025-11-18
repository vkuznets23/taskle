import { PrismaClient as OriginalPrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock =
  mockDeep<OriginalPrismaClient>() as DeepMockProxy<OriginalPrismaClient>

class PrismaClient {
  constructor() {
    return prismaMock
  }
}

export { PrismaClient }
export default PrismaClient
