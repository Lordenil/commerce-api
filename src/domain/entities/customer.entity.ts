export class Customer {
  constructor(
    public name: string,
    public email: string,
    public id?: string,
    public createdAt?: Date,
  ) {}
}
