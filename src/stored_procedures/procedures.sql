DELIMITER $$

CREATE PROCEDURE SelectUsers()
BEGIN
  SELECT * FROM users;
END$$

CREATE PROCEDURE CreateUser(
  IN firstName VARCHAR(50),
  IN lastName VARCHAR(50),
  IN mobileNumber VARCHAR(10),
  IN password VARCHAR(255),
  IN createdBy VARCHAR(50),
  IN updatedBy VARCHAR(50)
)
BEGIN
  INSERT INTO users (first_name, last_name, mobile_number, password, created_by, updated_by)
  VALUES (firstName, lastName, mobileNumber, password, createdBy, updatedBy);
END$$

CREATE PROCEDURE UpdateUser(
  IN userId INT,
  IN firstName VARCHAR(50),
  IN lastName VARCHAR(50),
  IN mobileNumber VARCHAR(10),
  IN updatedBy VARCHAR(50)
)
BEGIN
  UPDATE users
  SET first_name = firstName, last_name = lastName, mobile_number = mobileNumber, updated_by = updatedBy
  WHERE id = userId;
END$$

CREATE PROCEDURE DeleteUser(IN userId INT)
BEGIN
  DELETE FROM users WHERE id = userId;
END$$

DELIMITER ;
