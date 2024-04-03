const StatusCode = require("../helper/status_code_helper");
const DB = require("../dbConnectioon/dbConnection");

const adminCreate = async (data) => {
  try {
    const { email, name, password } = data;
    const sql = `INSERT INTO users (email, name , password) VALUES(?,?,?)`;
    await DB.query(sql, [email, name, password]);
    return new StatusCode.OK("New user registration successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const adminDelete = async (data) => {
  try {
    const { id } = data;
    const sql = `DELETE FROM users WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`User ID : ${id}  is deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const isAdminExit = async (data) => {
  try {
    const { email } = data;
    const sql = `SELECT * FROM users WHERE email=?`;
    const result = await DB.query(sql, [email]);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { adminCreate, adminDelete, isAdminExit };
