class User {
  constructor(id, name, email, password, role, status = 'active') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
  }
}

module.exports = User;