const Admin = require('./models/admin');

const admin1 = new Admin(1, 'Rahul', 'rahul@gmail.com');

console.log(admin1.getUserInfo());
console.log(admin1.getAdminRights());