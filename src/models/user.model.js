export default class User {
  constructor({ id, username, email, password, avatar, cart, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.cart = cart || [];
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }
}
