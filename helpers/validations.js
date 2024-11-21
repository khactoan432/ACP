async function validUser(email) {
  const isExist = await User.findOne({ email: email });
  if (!isExist) {
    return true;
  }
  return false;
}

async function validNameCodeforce(name) {
  // TODO:
  return true;
}

module.exports = {
  validUser: validUser,
  validNameCodeforce: validNameCodeforce,
};