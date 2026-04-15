import { PaginationResponse } from "../types/pagination-response";
import { PaginationQueryDto } from "../dtos/pagination.dto";

export class PaginationHelper {
  static getPaginationParams(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    return {
      page,
      limit,
      offset,
    };
  }

  static formatResponse<T>(data: T[], total: number, query: PaginationQueryDto): PaginationResponse<T> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
