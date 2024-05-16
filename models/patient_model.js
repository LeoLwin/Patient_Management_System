const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

// TODO: to follow coding standard

const patientCreate = async (name, dob, nrc, gender) => {
  try {
    // TODO: duplicate entry checking?
    const sql = "INSERT INTO patients (name, dob, nrc, gender) VALUES(?,?,?,?)";
    const result = await DB.query(sql, [name, dob, nrc, gender]);
    return new StatusCode.OK(result, "New patient registration successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientList = async (page) => {
  try {
    // TODO: sql injection
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT id, name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, nrc, gender FROM patients ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM patients";
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

// TODO: use individual parameters
const patientUpdate = async (name, dob, nrc, gender, id) => {
  try {
    const sql = `UPDATE patients SET name=?, dob=? ,nrc=?,gender=? WHERE id=?`;
    const result = await DB.query(sql, [name, dob, nrc, gender, id]);
    return new StatusCode.OK(null, "Pateint Data is updated");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientDelete = async (id) => {
  try {
    const sql = `DELETE FROM patients WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(null, `${id} id deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientNameSearch = async (name, page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `
      SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
      MATCH(name) AGAINST (?) AS relevance 
      FROM patients 
      WHERE MATCH(name) AGAINST (?) 
      ORDER BY 
        CASE WHEN name = ? THEN 1 ELSE 0 END DESC, 
        relevance DESC LIMIT ?, ?; 
    `;
    const result = await DB.query(sql, [name, name, name, offset, page_size]);
    // const result = await DB.query(sql, [name]);
    if (result.length > 0) {
      // const total = result.length;
      const sql = `SELECT COUNT(*) AS total FROM patients WHERE MATCH(name) AGAINST (?)`;
      const total = await DB.query(sql, [name]);
      return new StatusCode.OK({ result, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientNrcSearch = async (nrc) => {
  try {
    const sql = `SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') AS dob FROM patients WHERE nrc=?;`;
    const result = await DB.query(sql, [nrc]);
    if (result.length > 0) {
      const sql = `SELECT COUNT (*) AS total FROM patients WHERE nrc= ?`;
      const total = await DB.query(sql, [nrc]);
      return new StatusCode.OK({ result, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientIdSearch = async (id) => {
  try {
    const sql = `SELECT id, name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, nrc, gender FROM patients WHERE id=?`;
    const result = await DB.query(sql, [id]);
    if (result.length > 0) {
      const sql = `SELECT COUNT (*) AS total FROM patients WHERE id= ?`;
      const total = await DB.query(sql, [id]);
      return new StatusCode.OK({ result, total });
      // const patient = result[0];
      // return new StatusCode.OK({ patient });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
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
  patientNrcSearch,
  patientIdSearch,
};
