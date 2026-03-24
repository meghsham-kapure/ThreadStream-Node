db.createUser({
  user: "maverick",
  pwd: "supermaverick",
  roles: [{ role: "root", db: "admin" }]
})


mongosh -u maverick -p supermaverick --authenticationDatabase admin

mongodb://maverick:supermaverick@localhost:27017/myDatabase?authSource=admin
