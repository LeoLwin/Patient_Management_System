const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const moment = require("moment-timezone");
const nowMyanmar = moment.tz("Asia/Yangon").format("YYYY-MM-DD HH:mm:ss");

// TODO: to follow coding standard

const patientCreate = async (
  name,
  dob,
  nrc,
  passport,
  gender,
  imageUrl,
  created_by,
  last_p_ID
) => {
  try {
    // TODO: duplicate entry checking?
    const sql = `INSERT INTO patients (name, dob, nrc,passport, gender, imageUrl, created_by) VALUES(?,?,?,?,?,?,?)
      `;
    const result = await DB.query(sql, [
      name,
      dob,
      nrc,
      passport,
      gender,
      imageUrl,
      created_by,
    ]);

    console.log(result);
    let addlog;
    if (result.affectedRows == 1) {
      const sql = `
      INSERT INTO logs (user_email, patient_id, date_time, description) 
      VALUES (?, ?, ? , ?)
    `;
      let addlog = await DB.query(sql, [
        created_by,
        last_p_ID,
        nowMyanmar,
        "New Patient Created",
      ]);
      addlog = addlog;
    }

    return new StatusCode.OK(
      result,
      addlog,
      "New patient registration successful."
    );
  } catch (error) {
    console.log("error", error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patientList = async (page) => {
  try {
    // TODO: sql injection
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT id, name, DATE_FORMAT(dob, '%Y/%m/%d') AS dob, nrc,passport, gender, imageUrl FROM patients ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
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
const patientUpdate = async (
  name,
  dob,
  nrc,
  passport,
  gender,
  imageUrl,
  updated_by,
  id
) => {
  try {
    console.log("Update", {
      name,
      dob,
      nrc,
      passport,
      gender,
      imageUrl,
      updated_by,
      id,
    });
    const sql = `UPDATE patients SET name=?, dob=? ,nrc=?, passport=?, gender=?, imageUrl=? WHERE id=?`;
    const result = await DB.query(sql, [
      name,
      dob,
      nrc,
      passport,
      gender,
      imageUrl,
      id,
    ]);
    console.log(result);
    let addlog;
    if (result.affectedRows == 1) {
      const sql = `
      INSERT INTO logs (user_email, patient_id, date_time, description) 
      VALUES (?, ?, ? , ?)
    `;
      let addlog = await DB.query(sql, [
        updated_by,
        id,
        nowMyanmar,
        "Updated Patient.",
      ]);
      addlog = addlog;
      return new StatusCode.UNKNOWN(result, addlog);
    }
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
      SELECT *, DATE_FORMAT(dob, '%Y/%m/%d') AS dob
    FROM patients 
    WHERE MATCH(name) AGAINST (?) 
    ORDER BY 
    CASE WHEN name = ? THEN 1 ELSE 0 END DESC, 
      MATCH(name) AGAINST (?) DESC LIMIT ?, ?;
 
    `;
    const result = await DB.query(sql, [name, name, name, offset, page_size]);
    console.log({ result });
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
    const sql = `SELECT *, DATE_FORMAT(dob, '%Y/%m/%d') AS dob FROM patients WHERE nrc=?;`;
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
    const sql = `SELECT *,DATE_FORMAT(dob, '%Y/%m/%d') AS dob FROM patients WHERE id= ?`;
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

const patientPassportSearch = async (passport) => {
  try {
    const sql = `SELECT *,DATE_FORMAT(dob, '%Y/%m/%d') AS dob FROM patients WHERE passport= ?`;
    const result = await DB.query(sql, [passport]);
    if (result.length > 0) {
      const sql = `SELECT COUNT (*) AS total FROM patients WHERE passport= ?`;
      const total = await DB.query(sql, [passport]);
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

const patientCountStatus = async () => {
  try {
    const sql = `SHOW TABLE STATUS LIKE 'patients'`;
    const result = await DB.query(sql);

    if (result.length > 0) {
      const autoIncrementValue = result[0].Auto_increment;
      console.log(`Next auto-increment value: ${autoIncrementValue}`);
      return new StatusCode.OK({ autoIncrementValue });
    } else {
      return new StatusCode.NOT_FOUND("Table not found");
    }
  } catch (error) {
    console.error("Error executing query:", error.message);
    return new StatusCode.UNKNOWN(error.message);
  }
};

const overAllPatientData = async (patient_id) => {
  try {
    // const sql = `SELECT
    //            patients.id,
    //            patients.name,
    //            patients.dob,
    //            patients.nrc,
    //            patients.passport,
    //            patients.gender,
    //            patients.imageUrl,
    //            (SELECT JSON_OBJECT(
    //               'patient_1', partner.patient_id_1,
    //               'patient_2', partner.patient_id_2
    //             )
    //             FROM partner
    //             WHERE partner.patient_id_1 = patients.id OR partner.patient_id_2 = patients.id
    //            ) AS partner,
    //             (SELECT JSON_OBJECT(
    //            'partner_id' , patients.id,
    //            'partner_name' , patients.name,
    //            'partner_dob' , patients.dob,
    //            'partner_nrc' , patients.nrc,
    //            'partner_passport', patients.passport,
    //            'partner_gender', patients.gender,
    //            'partner_imageUrl', patients.imageUrl) FROM patients
    //             WHERE patients.id = patient_1 OR patients.id = patient_2 )AS partner_data,
    //            JSON_ARRAYAGG(
    //              JSON_OBJECT(
    //                'remark', follow_up.remark,
    //                'date_time', follow_up.date_time,
    //                'category', follow_up.category,
    //                'location_name', follow_up.location_name,
    //                'doctor_name', follow_up.doctor_name,
    //                'doctor_position', follow_up.doctor_position
    //              )
    //            ) AS follow_up,
    //            (SELECT JSON_ARRAYAGG(form_data.data)
    //             FROM form_data
    //             WHERE form_data.patient_id = patients.id
    //            ) AS form_data
    //          FROM
    //            patients
    //          LEFT JOIN follow_up ON patients.id = follow_up.patient_id
    //          WHERE patients.id = ?
    //          GROUP BY patients.id`;

    // const sql = `SELECT
    //               patients.id,
    //               patients.name,
    //               patients.dob,
    //               patients.nrc,
    //               patients.passport,
    //               patients.gender,
    //               patients.imageUrl,
    //               IFNULL(
    //                 (
    //                   SELECT JSON_OBJECT(
    //                     'patient_1', partner.patient_id_1,
    //                     'patient_2', partner.patient_id_2
    //                   ) AS partner
    //                   FROM partner
    //                   WHERE partner.patient_id_1 = patients.id OR partner.patient_id_2 = patients.id
    //                   LIMIT 1
    //                 ),
    //                 JSON_OBJECT('partner', NULL)
    //               ) AS partner,
    //               IFNULL(
    //                 (
    //                   SELECT JSON_OBJECT(
    //                     'partner_id', p.id,
    //                     'partner_name', p.name,
    //                     'partner_dob', p.dob,
    //                     'partner_nrc', p.nrc,
    //                     'partner_passport', p.passport,
    //                     'partner_gender', p.gender,
    //                     'partner_imageUrl', p.imageUrl,
    //                     'form_data', (
    //                       SELECT JSON_ARRAYAGG(fd.data)
    //                       FROM form_data fd
    //                       WHERE fd.patient_id = p.id
    //                     )
    //                   )
    //                   FROM patients AS p
    //                   WHERE p.id = (
    //                     SELECT partner.patient_id_1 FROM partner
    //                     WHERE partner.patient_id_2 = patients.id
    //                     LIMIT 1
    //                   ) OR p.id = (
    //                     SELECT partner.patient_id_2 FROM partner
    //                     WHERE partner.patient_id_1 = patients.id
    //                     LIMIT 1
    //                   )
    //                   LIMIT 1
    //                 ),
    //                 JSON_OBJECT(
    //                   'partner_id', NULL,
    //                   'partner_name', NULL,
    //                   'partner_dob', NULL,
    //                   'partner_nrc', NULL,
    //                   'partner_passport', NULL,
    //                   'partner_gender', NULL,
    //                   'partner_imageUrl', NULL,
    //                   'form_data', NULL
    //                 )
    //               ) AS partner_data,
    //               JSON_ARRAYAGG(
    //                 JSON_OBJECT(
    //                   'remark', follow_up.remark,
    //                   'date_time', follow_up.date_time,
    //                   'category', follow_up.category,
    //                   'location_name', follow_up.location_name,
    //                   'doctor_name', follow_up.doctor_name,
    //                   'doctor_position', follow_up.doctor_position
    //                 )
    //               ) AS follow_up,
    //               (
    //                 SELECT JSON_ARRAYAGG(form_data.data)
    //                 FROM form_data
    //                 WHERE form_data.patient_id = patients.id
    //               ) AS patient_form_data
    //             FROM
    //               patients
    //             LEFT JOIN follow_up ON patients.id = follow_up.patient_id
    //             WHERE patients.id = ?
    //             GROUP BY patients.id;
    //             `;
    // const result = await DB.query(sql, [patient_id]);

    const sql = `SELECT
                  patients.id,
                  patients.name,
                  patients.dob,
                  patients.nrc,
                  patients.passport,
                  patients.gender,
                  patients.imageUrl,
                  IFNULL(
                    (
                      SELECT JSON_OBJECT(
                        'patient_1', partner.patient_id_1,
                        'patient_2', partner.patient_id_2
                      ) AS partner
                      FROM partner
                      WHERE partner.patient_id_1 = patients.id OR partner.patient_id_2 = patients.id
                      LIMIT 1
                    ),
                    JSON_OBJECT('partner', NULL)
                  ) AS partner,
                  IFNULL(
                    (
                      SELECT JSON_OBJECT(
                        'partner_id', p.id,
                        'partner_name', p.name,
                        'partner_dob', p.dob,
                        'partner_nrc', p.nrc,
                        'partner_passport', p.passport,
                        'partner_gender', p.gender,
                        'partner_imageUrl', p.imageUrl,
                        'form_data', (
                          SELECT JSON_ARRAYAGG(fd.data)
                          FROM form_data fd
                          WHERE fd.patient_id = p.id
                        )
                      )
                      FROM patients AS p
                      WHERE p.id = (
                        SELECT partner.patient_id_1
                        FROM partner
                        WHERE partner.patient_id_2 = patients.id
                        LIMIT 1
                      ) OR p.id = (
                        SELECT partner.patient_id_2
                        FROM partner
                        WHERE partner.patient_id_1 = patients.id
                        LIMIT 1
                      )
                      LIMIT 1
                    ),
                    JSON_OBJECT(
                      'partner_id', NULL,
                      'partner_name', NULL,
                      'partner_dob', NULL,
                      'partner_nrc', NULL,
                      'partner_passport', NULL,
                      'partner_gender', NULL,
                      'partner_imageUrl', NULL,
                      'form_data', NULL
                    )
                  ) AS partner_data,
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'remark', follow_up.remark,
                      'date_time', follow_up.date_time,
                      'category', follow_up.category,
                      'location_name', follow_up.location_name,
                      'doctor_name', follow_up.doctor_name,
                      'doctor_position', follow_up.doctor_position
                    )
                  ) AS follow_up,
                  (
                    SELECT JSON_ARRAYAGG(form_data.data)
                    FROM form_data
                    WHERE form_data.patient_id = patients.id
                  ) AS patient_form_data
                FROM
                  patients
                LEFT JOIN follow_up ON patients.id = follow_up.patient_id
                WHERE patients.id = ?
                GROUP BY patients.id;
                `;

    const result = await DB.query(sql, [patient_id]);
    console.log(result);
    return new StatusCode.OK(result[0]);
  } catch (error) {
    console.log(error);
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
  patientPassportSearch,
  patientCountStatus,
  overAllPatientData,
};
