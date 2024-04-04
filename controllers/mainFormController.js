const e = require("express");
const StatusCode = require("../helper/status_code_helper");
const MainForm = require("../models/mainFormModel");

const mainFormCreate = async (data) => {
  try {
    const { title, multiple_Entry, description } = data;
    const result = await MainForm.mainFormCreate({
      title,
      multiple_Entry,
      description,
    });
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const mainFormList = async (page) => {
  try {
    const result = await MainForm.mainFormList(page);
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const mainFormUpdate = async (data) => {
  try {
    const { id, title, multiple_Entry, description } = data;
    const result = await MainForm.mainFormUpdate({
      id,
      title,
      multiple_Entry,
      description,
    });
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const mainFormDelete = async (id) => {
  try {
    const result = await MainForm.mainFormDelete(id);
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = {
  mainFormCreate,
  mainFormList,
  mainFormUpdate,
  mainFormDelete,
};
