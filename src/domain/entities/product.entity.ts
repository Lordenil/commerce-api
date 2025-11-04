export class Product {
  constructor(
    public name: string,
    public description: string,
    public sku: string,
    public price: number,
    public currency: string,
    public stock: number,
    public id?: string,
    public createdAt: Date = new Date(),
  ) {}
}
