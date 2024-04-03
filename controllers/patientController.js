const Patient = require("../models/patientModel");
const StatusCode = require("../helper/status_code_helper");

const patientCreate = async (data) => {
  try {
    const { Name, DOB } = data;
    const result = await Patient.patientCreate({ Name, DOB });
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const patientList = async (page) => {
  try {
    const result = await Patient.patientList(page);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const patientUpdate = async (data) => {
  try {
    const { Name, DOB, id } = data;
    const result = await Patient.patientUpdate({ Name, DOB, id });
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const patientDelete = async (id) => {
  try {
    const result = await Patient.patientDelete(id);
    return new StatusCode.OK(result);
  } catch (error) {
    res.status(error);
  }
};

module.exports = { patientCreate, patientList, patientUpdate, patientDelete };
