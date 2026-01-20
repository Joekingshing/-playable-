import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@backend/database';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  listUsers() {
    return this.database.getUsers();
  }
}
