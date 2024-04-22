const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const fromDataCreate = async (data, patient_id) => {
  try {
    const sql = `INSERT INTO form_data (data, patient_id) VALUES (?,?)`;
    await DB.query(sql, [data, patient_id]);
    return new StatusCode.OK(null, "New Form_data is created.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const formDataList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM form_data ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM form_data";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;
    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const formDataUpdate = async (data, patient_id, id) => {
  try {
    const sql = `UPDATE form_data SET data=?, patient_id=? WHERE id=?`;
    await DB.query(sql, [data, patient_id, id]);
    return new StatusCode.OK(null, "Update Successfully");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const formDataDelete = async (id) => {
  try {
    const sql = `DELETE FROM form_data WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`${id} id deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const formDataPatientSearch = async (patient_id) => {
  try {
    const sql = `SELECT * FROM form_data WHERE patient_id=?`;
    const result = await DB.query(sql, [patient_id]);
    if (result.length > 0) {
      return new StatusCode.OK(result);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  fromDataCreate,
  formDataList,
  formDataUpdate,
  formDataDelete,
  formDataPatientSearch,
};
