// module.exports = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME || 'mydb',
//   };
  
const dbConfig = {
  url: process.env.DB_URL || "mongodb://localhost:27017/bakery",
};

module.exports = dbConfig;

