const StatusCode = require("../helper/status_code_helper");
const DB = require("../dbConnectioon/dbConnection");

const mainFormCreate = async (data) => {
  try {
    const { title, multipleEntry, description } = data;
    console.log(title, multipleEntry, description);
    const sql = `INSERT INTO main_form (title, multiple_Entry, description) VALUES (?,?,?)`;
    await DB.query(sql, [title, multipleEntry, description]);
    return new StatusCode.OK("New Main Form is created.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const mainFormList = async (page) => {
  try {
    console.log(page);
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM main_form ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM patients";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;
    return new StatusCode.OK({ list, total });
  } catch (error) {}
};

module.exports = { mainFormCreate, mainFormList };
