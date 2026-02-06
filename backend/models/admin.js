const User = require('./user');

class Admin extends User {
  constructor(id, name, email) {
    super(id, name, email, 'admin');
  }

  getAdminRights() {
    return 'Admin can manage users, services, and bookings';
  }
}
module.exports = Admin;