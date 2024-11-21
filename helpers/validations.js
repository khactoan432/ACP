const { User } = require("../models/");

const validUser = async (email) => {
  try {
    const isExist = await User.findOne({ email: email });
    return isExist ? true : false;
  } catch (error) {
    console.log("error: ", error);
  }
};

const validNameCodeforce = async (name) => {
  // TODO:
  try {
    return true;
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = {
  validUser: validUser,
  validNameCodeforce: validNameCodeforce,
};
