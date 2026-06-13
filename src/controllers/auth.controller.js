import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Secret key used to sign the JWT (should be in .env in production)
const JWT_SECRET = "victoriassound_secret_key";

// POST /auth/login → validates credentials and returns a JWT
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that both fields are present
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email y password son obligatorios" });
    }

    // Search for the user by email in the database
    const user = await User.findOne({ where: { email } });

    // If the user does not exist, return 401
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email y/o contraseña incorrectos" });
    }

    // Compare the received password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return 401
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email y/o contraseña incorrectos" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Return the token and the user data without the password
    res.json({
      token,
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      error,
    });
  }
};