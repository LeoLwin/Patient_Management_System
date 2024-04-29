const StatusCode = require("../helper/status_code_helper");
const DB = require("../helper/database_helper");
const Patient = require("../models/patient_model");

const partnerCreate = async (patient_id_1, patient_id_2) => {
  try {
    const sql = "INSERT INTO partner (patient_id_1, patient_id_2) VALUES(?,?)";
    await DB.query(sql, [patient_id_1, patient_id_2]);
    return new StatusCode.OK(null, "New Partner link successful.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const partnerList = async (page) => {
  try {
    const page_size = 10;
    const offset = (page - 1) * page_size;
    const sql = `SELECT * FROM partner ORDER BY id DESC LIMIT ${page_size} OFFSET ${offset}`;
    const list = await DB.query(sql, [page_size, offset]);

    // Query to count total number of bundles
    const countSql = "SELECT COUNT(*) AS total FROM partner";
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

const partnerUpdate = async (patient_id_1, patient_id_2, id) => {
  try {
    const sql = `UPDATE partner SET patient_id_1=?, patient_id_2=?WHERE id=?`;
    const result = await DB.query(sql, [patient_id_1, patient_id_2, id]);
    return new StatusCode.OK(null, "Pateint Data is updated");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const partnerDelete = async (id) => {
  try {
    const sql = `DELETE FROM partner WHERE id=?`;
    await DB.query(sql, [id]);
    return new StatusCode.OK(null, `Realtion id-${id} is deleted.`);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const partnerSearch = async (patient_id) => {
  try {
    const sql = `SELECT * FROM partner WHERE (patient_id_1=?) OR (patient_id_2=?)`;
    const result = await DB.query(sql, [patient_id, patient_id]);
    return result.length > 0
      ? result[0].patient_id_1 == patient_id
        ? new StatusCode.OK(
            await Patient.patientIdSearch(result[0].patient_id_2)
          )
        : new StatusCode.OK(
            await Patient.patientIdSearch(result[0].patient_id_1)
          )
      : new StatusCode.NOT_FOUND(null);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const patrnerIsExists = async (patient_id, partner_id) => {
  try {
    // Use a single SQL query to check both patient_id_1 and patient_id_2 in the same query
    const sql = `
      SELECT * 
      FROM partner
      WHERE (patient_id_1 = ?) OR (patient_id_1 = ?)
         OR (patient_id_2 = ?) OR (patient_id_2 = ?)
    `;
    const relation = await DB.query(sql, [
      patient_id,
      partner_id,
      partner_id,
      patient_id,
    ]);
    return relation.length > 0
      ? new StatusCode.ALREADY_EXISTS(relation)
      : new StatusCode.NOT_FOUND();
  } catch (error) {
    return new StatusCode.OK(error.message);
  }
};

const partnerCheck = async (patient_id, partner_id) => {
  try {
    const relation = await patrnerIsExists(patient_id, partner_id);
    return new StatusCode.OK(relation);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  partnerCreate,
  partnerList,
  partnerUpdate,
  partnerDelete,
  partnerCheck,
  partnerSearch,
};
