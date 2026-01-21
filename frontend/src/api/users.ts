import { apiGet } from './client';

export type User = {
  id: number;
  name: string;
};

export function fetchUsers() {
  return apiGet<User[]>('/users');
}
