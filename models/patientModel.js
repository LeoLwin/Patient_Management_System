const StatusCode = require("../helper/status_code_helper");
const DB = require("../dbConnectioon/dbConnection");

// TODO: to follow coding standard

const patientCreate = async (Name, DOB) => {
  try {
    // TODO: duplicate entry checking?
    console.log(Name, DOB);
    const sql = "INSERT INTO patients (Name, DOB) VALUES(?,?)";
    await DB.query(sql, [Name, DOB]);
    return new StatusCode.OK("New patient registration successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientList = async (page) => {
  try {
    // TODO: sql injection
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM patients ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql); // TODO: check value of this

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

// TODO: use individual parameters
const patientUpdate = async (Name, DOB, id) => {
  try {
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
