const StatusCode = require("../helper/status_code_helper");
const MainForm = require("../models/mainFormModel");

const mainFormCreate = async (data) => {
  try {
    const { title, multipleEntry, description } = data;
    const result = await MainForm.mainFormCreate({
      title,
      multipleEntry,
      description,
    });
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const mainFormList = async (page) => {
  try {
    const result = await MainForm.mainFormList(page);
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = { mainFormCreate, mainFormList };
