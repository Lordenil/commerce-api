import { v4 as uuidv4 } from 'uuid';

export class Customer {
  constructor(
    public readonly id: string = uuidv4(),
    public name: string,
    public email: string,
    public stripeCustomerId?: string,
    public createdAt: Date = new Date(),
  ) {}
}
