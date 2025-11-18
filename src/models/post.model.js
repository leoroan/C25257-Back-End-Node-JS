export default class Post {
  constructor({ id, name, text, likes, createdAt }) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.likes = Number(likes);
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }
}
