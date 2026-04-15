import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { QueryPagination } from 'src/common/types/query-pagination';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll({
    pagination,
    filters
  }: {
    pagination?: QueryPagination;
    filters?: {
      email?: string;
      name?: string;
      tenantId?: string;
    };
  }) {
    return await this.userRepository.findAll({pagination, filters});
  }
}
