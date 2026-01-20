import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  getUsers() {
    return [
      { id: 1, name: 'Ada Lovelace' },
      { id: 2, name: 'Grace Hopper' },
      { id: 3, name: 'Alan Turing' },
    ];
  }
}
