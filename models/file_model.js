const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const fileCreate = async (patient_id, file_name) => {
  try {
    const sql = `INSERT INTO files (patient_id, file_name) VALUES (?,?)`;
    await DB.query(sql, [patient_id, file_name]);
    return new StatusCode.OK(null, "New file is created.");
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

const fileList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM files ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM files";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

const fileUpdate = async (patient_id, file_name, id) => {
  try {
    const sql = `UPDATE files SET  patient_id =?, file_name=? WHERE id=?`;
    const result = await DB.query(sql, [patient_id, file_name, id]);
    return new StatusCode.OK(null, "File Data is updated");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

const fileDelete = async (id) => {
  try {
    console.log(id);
    const sql = `DELETE FROM files WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(null, `File ${id} is deleted`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.mesaage);
  }
};

module.exports = { fileCreate, fileList, fileUpdate, fileDelete };
