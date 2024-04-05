const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

// TODO: to follow coding standard

const patientCreate = async (name, dob, nrc) => {
  try {
    // TODO: duplicate entry checking?
    console.log(name, dob, nrc);
    const sql = "INSERT INTO patients (name, dob, nrc) VALUES(?,?,?)";
    await DB.query(sql, [name, dob, nrc]);
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
    // const sql = `SELECT * FROM patients ORDER BY id DESC LIMIT ?,?`;
    const list = await DB.query(sql, [page_size, offset]); // TODO: check value of this

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM patients";
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;
    return new StatusCode.OK({ list, total });
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

// TODO: use individual parameters
const patientUpdate = async (name, dob, nrc, id) => {
  try {
    const sql = `UPDATE patients SET name=?, dob=? ,nrc=? WHERE id=?`;
    const result = await DB.query(sql, [name, dob, nrc, id]);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientDelete = async (id) => {
  try {
    const sql = `DELETE FROM patients WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`${id} id deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientNameSearch = async (Name) => {
  try {
    const sql = `SELECT * FROM patients WHERE MATCH(Name) AGAINST (?);`;
    const result = await DB.query(sql, [Name]);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  patientCreate,
  patientList,
  patientUpdate,
  patientDelete,
  patientNameSearch,
};