const StatusCode = require("../helper/status_code_helper");
const DB = require("../dbConnectioon/dbConnection");

const patientCreate = async (data) => {
  try {
    const { Name, DOB } = data;
    const sql = "INSERT INTO patients (Name, DOB) VALUES(?,?)";
    await DB.query(sql, [Name, DOB]);
    return new StatusCode.OK("New patient registration successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM patients ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM patients";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;
    console.log(list, total);
    return new StatusCode.OK({ list, total });
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientUpdate = async (data) => {
  try {
    const { Name, DOB, id } = data;
    const sql = `UPDATE patients SET Name=?, DOB=? WHERE id=?`;
    const result = await DB.query(sql, [Name, DOB, id]);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientDelete = async (id) => {
  try {
    const sql = ` DELETE FROM patients WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`${id} id deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { patientCreate, patientList, patientUpdate, patientDelete };
