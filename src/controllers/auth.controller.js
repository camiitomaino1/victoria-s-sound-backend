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

    // Check if the user account is active
    if (!user.activo) {
      return res
        .status(401)
        .json({
          message: "Tu cuenta está desactivada. Contactá al administrador.",
        });
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

// POST /auth/register → creates a new account with role 'user'
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validate that all required fields are present
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "nombre, email y password son obligatorios" });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Ya existe una cuenta con ese email" });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with role 'user' regardless of what the client sends
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: "user",
    });

    // Return 201 with the new user data, never expose the password
    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};
