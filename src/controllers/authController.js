const userModel = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { first_name, last_name, mobile_number, password } = req.body;
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = {
    first_name: first_name,
    last_name: last_name,
    mobile_number: mobile_number,
    password: hashedPassword,
    created_by: first_name,
    updated_by: "system",
  };

  try {
    const result = await userModel.insertUser(user);
    if (!result.error) {
      res.status(201).send(result);
    } else {
      res.status(500).send(result);
    }
  } catch (error) {
    res.status(500).send({ error:true, msg: error.details });
  }
};

const loginUser = async (req, res) => {
  const { mobile_number, password } = req.body;
  console.log("login",req.body)
  const user = await userModel.getUserByMobile(mobile_number);
  if (user) {
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Invalid password",error:true });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ msg: "Login successful", token:token,error:false ,full_name:`${user.first_name} ${user.last_name}`});
  } else {
    return res.status(404).send({ msg: "User not found" ,error:true});
  }
};

const updateUser = async (req, res) => {
  const { first_name, last_name, mobile_number, updated_by } = req.body;
  const user_info = await userModel.getUserByMobile(mobile_number);
  if (user_info) {
    const user = {
      id: user_info.id,
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      updated_by: updated_by,
    };
    const data = await userModel.updateUser(user);
    if (data.results != null) {
      res.status(200).send({ msg: "User updated successfully",error:false });
    } else {
      return res.status(500).send({ msg: "Database error",error:true });
    }
  } else {
    return res.status(500).send({ msg: "No such user found",error:true });
  }
};

const deleteUser = async (req, res) => {
  const { mobile_number, password } = req.body;
  console.log(mobile_number);
  const user = await userModel.getUserByMobile(mobile_number);
  if (user) {
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Invalid password",error:true });
    }
    const data = userModel.deleteUser(user.id);
    if (!data.error) {
      return res.status(200).send({ msg: "User deleted successfully",error:false });
    } else {
      return res.status(500).send({ msg: "Database error",error:true });
    }
  } else {
    return res.status(500).send({ msg: "No such user found",error:true });
  }
};
module.exports = { registerUser, loginUser, updateUser, deleteUser };
