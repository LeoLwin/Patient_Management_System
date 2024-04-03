const StatusCode = require("../helper/status_code_helper");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const { get } = require("lodash");
const comparePassword = require("../utils/comparePassword");

const adminCreate = async (data) => {
  try {
    const { email, name, password } = data;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const result = await Admin.adminCreate({ email, name, password: hash });
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const adminDelete = async (id) => {
  try {
    const result = await Admin.adminDelete({ id });
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const adminLogin = async (data) => {
  try {
    const { email, password } = data;
    const getUser = await Admin.isAdminExit({ email });
    const isTrue = await comparePassword({ getUser, password });
    return isTrue;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const isAdminExit = async (data) => {
  try {
    const { email } = data;
    const result = await Admin.isAdminExit({ email });
    return result;
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = { adminCreate, adminDelete, isAdminExit, adminLogin };
