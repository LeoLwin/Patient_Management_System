const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");

const hospAndLabCreate = async (patient_id, date, location_name, remark) => {
  try {
    const sql =
      "INSERT INTO hospital_and_lab (patient_id, date,location_name,remark) VALUES(?,?,?,?)";
    await DB.query(sql, [patient_id, date, location_name, remark]);
    return new StatusCode.OK(null, "New  Hospital and Lab is created!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

// async (page) => {
//     try {
//       const page_size = 10;
//       const offset = (page - 1) * page_size;
//       const sql = `SELECT * FROM partner ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
//       const list = await DB.query(sql, [page_size, offset]);

//       // Query to count total number of bundles
//       const countSql = "SELECT COUNT(*) AS total FROM partner";
//       const countResult = await DB.query(countSql);
//       const total = countResult[0].total;

//       if (list.length > 0) {
//         return new StatusCode.OK({ list, total });
//       } else {
//         return new StatusCode.NOT_FOUND(null);
//       }
//     } catch (error) {
//       return new StatusCode.UNKNOWN(error.message);
//     }

// include page and page_size
const hospAndLabList = async (page, page_size) => {
  try {
    // const page_size = 10;
    const offset = (page - 1) * page_size;

    const sql = `SELECT *, DATE_FORMAT(date, '%Y/%m/%d') AS date FROM hospital_and_lab ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    // const sql = `SELECT * FROM hospital_and_lab ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;

    const list = await DB.query(sql, [page_size, offset]);

    //Query to count total number of bundles
    const countSql = `SELECT COUNT(*) AS TOTAL FROM hospital_and_lab`;
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

//does not include page and page_size
const hospAndLabOnlyList = async () => {
  try {
    const sql = `SELECT *, DATE_FORMAT(date, '%Y/%m/%d') AS date FROM hospital_and_lab`;
    const list = await DB.query(sql);

    const countSql = `SELECT COUNT(*) AS total FROM hospital_and_lab`;
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

// Search With Patient ID / does not include page and page_size
const hospAndLabPatientIdSearch = async (patient_id) => {
  try {
    const sql = `SELECT *, DATE_FORMAT(date, '%Y/%m/%d') AS date FROM hospital_and_lab WHERE patient_id=?`;
    const list = await DB.query(sql, [patient_id]);

    const countSql = `SELECT COUNT(*) AS total FROM hospital_and_lab`;
    const countResult = await DB.query(countSql);
    const total = countResult[0].total;

    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const hospAndLabUpdate = async (
  patient_id,
  date,
  location_name,
  remark,
  id
) => {
  try {
    const sql = `UPDATE hospital_and_lab SET patient_id = ?, date = ?,location_name = ?,remark = ? WHERE id=?`;
    const result = await DB.query(sql, [
      patient_id,
      date,
      location_name,
      remark,
      id,
    ]);
    if (result.affectedRows == 1) {
      return new StatusCode.OK(result, "Pateint Data is updated");
    }

    return new StatusCode.OK(result, "Pateint Data is not update!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const hospAndLabDelete = async (id) => {
  try {
    const sql = `DELETE FROM hospital_and_lab WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(`Hospital and Lab id ${id} is deleted!`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const hospAndLabIdSearch = async (id) => {
  try {
    const sql = `SELECT *, DATE_FORMAT(date, '%Y/%m/%d') AS date FROM hospital_and_lab WHERE id=?`;
    const result = await DB.query(sql, [id]);
    if (result.length > 0) {
      return new StatusCode.OK();
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  hospAndLabCreate,
  hospAndLabList,
  hospAndLabUpdate,
  hospAndLabDelete,
  hospAndLabOnlyList,
  hospAndLabPatientIdSearch,
  hospAndLabIdSearch,
};
