const db = require('../config/db');
const fs = require('fs');
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(10) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50),
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(50)
)`;

db.query(createUserTable)
  .then(() => console.log('User table created successfully'))
  .catch((err) => console.error('Could not create user table', err));

// const insertUser = async (user) => {
//   const [result] = await db.execute(
//     'INSERT INTO users (first_name, last_name, mobile_number, password, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
//     [user.first_name, user.last_name, user.mobile_number, user.password, user.created_by, user.updated_by]
//   );
//   return result;
// };

// const getUserByMobile = async (mobile_number) => {
//   const [rows] = await db.execute(
//     'SELECT * FROM users WHERE mobile_number = ?',
//     [mobile_number]
//   );
//   return rows[0];
// };
const insertUser = async (user) => {
  try {
    const existingUser = await getUserByMobile(user.mobile_number);
    if (existingUser) {
      return { msg: 'User with this mobile number already exists',error:true };
    }

    const [result] = await db.execute('CALL CreateUser(?, ?, ?, ?, ?, ?)', [
      user.first_name,
      user.last_name,
      user.mobile_number,
      user.password,
      user.created_by,
      user.updated_by
    ]);
    return { msg: 'User successfully registered' ,error:false};
  } catch (err) {
    return { msg: 'Database error',error:true};
  }
};

const getUserByMobile = async (mobile_number) => {
  try {
    const [results] = await db.execute('CALL SelectUsers()');
    const user = results[0].find(u => u.mobile_number === mobile_number);
    return user;
  } catch (err) {
    return { msg: 'Database error',error:true};
  }
};

const updateUser = async (user) => {
  try {
    const [result] = await db.execute('CALL UpdateUser(?, ?, ?, ?, ?)', [
      user.id,
      user.first_name,
      user.last_name,
      user.mobile_number,
      user.updated_by
    ]);
    return {results:result};
  } catch (err) {
    return { results:null};
  }
};

const deleteUser = async (userId) => {
  try {
    await db.execute('CALL DeleteUser(?)', [userId]);
    return {error:false};
  } catch (err) {
    return { error:true };
  }
};

module.exports = { insertUser, getUserByMobile, updateUser, deleteUser };