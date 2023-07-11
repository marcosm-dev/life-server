const User = require("../models/user.model");

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      where: req.query,
    });
    return !users
      ? res.status(404).send("No existen usuarios")
      : res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create({
      userName: req.body.userName,
      lastName: req.body.lastName,
      cifDni: req.body.cifDni,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      access: req.body.access,
      address: req.body.address
    });
    return res.status(200).json({ message: "User created", user: user });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getAllUsers,
  createUser,
};
