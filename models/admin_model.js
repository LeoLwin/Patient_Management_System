const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const adminCreate = async (email, name, password) => {
  try {
    const sql = `INSERT INTO users (email, name , password) VALUES(?,?,?)`;
    await DB.query(sql, [email, name, password]);
    return new StatusCode.OK(null, "New user registration successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const adminList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM users ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM users";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK(list, total);
    } else {
      // console.log("Admin does not exist");
      return new StatusCode.NOT_FOUND(null, "Admin does not exist");
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const adminDelete = async (id) => {
  try {
    const sql = `DELETE FROM users WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`User ID : ${id}  is deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const isAdminExist = async (email) => {
  try {
    const sql = `SELECT * FROM users WHERE email=?`;
    const result = await DB.query(sql, [email]);
    if (result.length > 0) {
      return new StatusCode.OK(result);
    } else {
      // console.log("Admin does not exist");
      return new StatusCode.NOT_FOUND(null, "Admin does not exist");
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { adminCreate, adminDelete, isAdminExist, adminList };
