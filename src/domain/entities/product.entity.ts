export class Product {
  constructor(
    public name: string,
    public sku: string,
    public priceCents: number,
    public currency: string,
    public stock: number,
    public id?: string,
    public createdAt: Date = new Date(),
  ) {}
}
