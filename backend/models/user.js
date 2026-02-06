class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  getUserInfo() {
    return `${this.name} (${this.role})`;
  }
}
module.exports = User;