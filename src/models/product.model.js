export default class Product {
  constructor({ id, name, description, price, stock, image, createdAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = parseFloat(price);
    this.stock = Number(stock);
    this.image = image;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }
}
