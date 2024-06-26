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

    const countSql = `SELECT COUNT(*) AS total FROM hospital_and_lab WHERE patient_id=?`;
    const countResult = await DB.query(countSql, [patient_id]);
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
      return new StatusCode.OK(result[0]);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

// const hospAndLabDateSearch = async (start_date, end_date) => {
//   try {
//     console.log("Date Model ", start_date, end_date);

//     const sql = `SELECT *,DATE_FORMAT(date, '%Y/%m/%d') as date FROM hospital_and_lab WHERE date BETWEEN ? AND ?`;

//     const list = await DB.query(sql, [start_date, end_date]);

//     const countSql = `SELECT COUNT(*) AS total FROM hospital_and_lab WHERE date BETWEEN ? AND ?`;
//     const countResult = await DB.query(countSql, [start_date, end_date]);
//     const total = countResult[0].total;

//     if (list.length > 0) {
//       return new StatusCode.OK({ list, total });
//     } else {
//       return new StatusCode.NOT_FOUND(null);
//     }
//   } catch (error) {
//     console.error("Error in hospAndLabDateSearch:", error);
//     return new StatusCode.UNKNOWN(error.message);
//   }
// };

// const hospAndLabDateSearchHepler = async (patient_id) => {
//   try {
//     const sql = `SELECT patients.id AS Patient_id,
//         patients.name AS Name,
//         patients.nrc AS NRC,
//         hospital_and_lab.date AS Date,
//         hospital_and_lab.location_name AS Location,
//         hospital_and_lab.remark AS Remark
//   FROM patients
//   LEFT JOIN hospital_and_lab ON patients.id = hospital_and_lab.patient_id
//   WHERE patients.id = ?;
// `;

//     const result = await DB.query(sql, [patient_id]);
//     return new StatusCode.OK(result);
//   } catch (error) {
//     console.error("Error in hospAndLabDateSearchHepler:", error);
//     return new StatusCode.UNKNOWN(error.message);
//   }
// };

const hospAndLabDateSearch = async (start_date, end_date, location_name) => {
  try {
    // Step 1: Search hospital and lab records between start_date and end_date
    const sqlStep1 = `
          SELECT hospital_and_lab.id AS Record_id,
                 hospital_and_lab.date AS Record_Date,
                 hospital_and_lab.location_name AS Record_Location,
                 hospital_and_lab.remark AS Record_Remark,
                 hospital_and_lab.patient_id AS Patient_id
          FROM hospital_and_lab
          WHERE date BETWEEN ? AND ? AND location_name= ?
        `;
    const paramsStep1 = [start_date, end_date, location_name];
    const records = await DB.query(sqlStep1, paramsStep1);

    // Step 2: Retrieve patient information for each record found
    const list = [];
    for (const record of records) {
      const {
        Patient_id,
        Record_id,
        Record_Date,
        Record_Location,
        Record_Remark,
      } = record;
      const sqlStep2 = `
            SELECT patients.id AS Patient_id,
                   patients.name AS Name,
                   patients.nrc AS NRC,
                   DATE_FORMAT(date, '%Y/%m/%d') as Date,
                   hospital_and_lab.location_name AS Location,
                   hospital_and_lab.remark AS Remark
            FROM patients
            LEFT JOIN hospital_and_lab ON patients.id = hospital_and_lab.patient_id
            WHERE patients.id = ?
              AND hospital_and_lab.id = ?
          `;
      const paramsStep2 = [Patient_id, Record_id];
      const patientInfo = await DB.query(sqlStep2, paramsStep2);
      if (patientInfo.length > 0) {
        list.push({
          patient_id: patientInfo[0].Patient_id,
          name: patientInfo[0].Name,
          nrc: patientInfo[0].NRC,
          date: patientInfo[0].Date,
          location: Record_Location,
          remark: Record_Remark,
        });
      }
    }

    const countSql = `SELECT COUNT(*) AS total FROM hospital_and_lab WHERE date BETWEEN ? AND ?`;
    const countResult = await DB.query(countSql, [start_date, end_date]);
    const total = countResult[0].total;

    // Return results
    if (list.length > 0) {
      return new StatusCode.OK({ list, total });
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    console.error("Error in hospAndLabSearch:", error);
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
  hospAndLabDateSearch,
};
