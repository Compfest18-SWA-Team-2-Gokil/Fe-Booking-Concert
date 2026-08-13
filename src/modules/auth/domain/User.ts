export interface User {
  id: string;
  email: string;
  name: string;
  role: 'BUYER' | 'ORGANIZER' | 'GATE_OPERATOR' | 'ADMIN';
}
