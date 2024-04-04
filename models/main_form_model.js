const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const mainFormCreate = async (title, multiple_Entry, description) => {
  try {
    const sql = `INSERT INTO main_form (title, multiple_Entry, description) VALUES (?,?,?)`;
    await DB.query(sql, [title, multiple_Entry, description]);
    return new StatusCode.OK("New Main Form is created.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const mainFormList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM main_form ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM main_form";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;
    return new StatusCode.OK({ list, total });
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const mainFormUpdate = async (title, multiple_Entry, description, id) => {
  try {
    const sql = `UPDATE main_form SET title=?, multiple_Entry=?, description=? WHERE id=?;`;
    await DB.query(sql, [title, multiple_Entry, description, id]);
    return new StatusCode.OK(`Main-Form ${id} is updated.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const mainFormDelete = async (id) => {
  try {
    const sql = `DELETE FROM main_form WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`Form id-${id} is deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  mainFormCreate,
  mainFormList,
  mainFormUpdate,
  mainFormDelete,
};
