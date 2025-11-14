export default class Post {
  constructor({ id, name, text, likes }) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.likes = Number(likes);
    this.createdAt = new Date();
  }
}
