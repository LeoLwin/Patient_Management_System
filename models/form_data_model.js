const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const fromDataCreate = async (data, patient_id) => {
  try {
    // console.log(data, patient_id);
    const sql = `INSERT INTO form_data (data, patient_id) VALUES (?,?)`;
    await DB.query(sql, [data, patient_id]);
    return new StatusCode.OK("New Form_data is created.");
  } catch (error) {
    console.log(error);
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
    return new StatusCode.OK({ list, total });
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const formDataUpdate = async (data, patient_id, id) => {
  try {
    console.log(data, patient_id, id);
    const sql = `UPDATE form_data SET data=?, patient_id=? WHERE id=?`;
    const result = await DB.query(sql, [data, patient_id, id]);
    return new StatusCode.OK(result);
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
    console.log(patient_id);
    const sql = `SELECT * FROM form_data WHERE patient_id=?`;
    const result = await DB.query(sql, [patient_id]);
    return new StatusCode.OK(result);
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
