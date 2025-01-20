const axios = require("axios");
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
  try {
    const response = await axios.get(
      `https://codeforces.com/api/user.info?handles=${name}`
    );
    console.log("res", response.data.status);
    if (response.data.status === "OK") {
      return {
        exists: true,
        user: response.data.result[0],
      };
    } else {
      return {
        exists: false,
      };
    }
  } catch (error) {
    if (error.response && error.response.data.comment) {
      return {
        exists: false,
        message: error.response.data.comment,
      };
    }
    console.error("Error fetching from Codeforces API:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  validUser: validUser,
  validNameCodeforce: validNameCodeforce,
};
