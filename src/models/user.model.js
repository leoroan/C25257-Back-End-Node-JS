export default class User {
  constructor({ id, username, email, password, avatar, cart, role, createdAt }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.cart = cart || [];
    this.role = role ||'user';
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }
}
