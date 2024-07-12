const userModel = require('./../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { first_name, last_name, mobile_number, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(hashedPassword);
  const user = {
    first_name:first_name,
    last_name:last_name,
    mobile_number:mobile_number,
    password: hashedPassword,
    created_by:first_name,
    updated_by:'system'
  };

  try {
    const result = await userModel.insertUser(user);
    res.status(201).send({result });
  } catch (error) {
    res.status(500).send({ error: error.error, details: error.details });
  }
};

const loginUser = async (req, res) => {
  const { mobile_number, password } = req.body;
  const user = await userModel.getUserByMobile(mobile_number);
  if(user){
    
  
  

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ message: 'Login successful', token });
  }else{
    return res.status(404).send({ error: 'User not found' });
  }
};

const updateUser = async (req, res) => {
  const {  first_name, last_name, mobile_number, updated_by } = req.body;
  const user_info = await userModel.getUserByMobile(mobile_number);
  if(user_info){
    const user = {
      id:user_info.id,
      first_name:first_name,
      last_name:last_name,
      mobile_number:mobile_number,
      updated_by:updated_by
    };
    const data = await userModel.updateUser(user);
    if(data.results!=null){
      res.status(200).send({ message: 'User updated successfully' });
    }
    else{
      return res.status(500).send({ error: 'Database error'});
    }
  }
  else{
    return  res.status(500).send({ error: 'No such user found' });
  }
};

const deleteUser = async (req, res) => {
  const { mobile_number,password } = req.body;
  console.log(mobile_number);
  const user = await userModel.getUserByMobile(mobile_number);
  if(user){
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: 'Invalid password' });
    }
    const data = userModel.deleteUser(user.id);
    if(data.results!=null){
      return res.status(200).send({ message: 'User deleted successfully' });
    }
    else{
      return res.status(500).send({ error: 'Database error' });
    }
  }else{
    return  res.status(500).send({ error: 'No such user found'});
  }
   
};
module.exports = {registerUser,loginUser,updateUser,deleteUser};