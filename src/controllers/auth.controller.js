import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const JWT_SECRET = 'victoriassound_secret_key'

// Regex that enforces: min 8 chars, uppercase, lowercase, number and special character
// Same regex used in the frontend to keep validation consistent
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

// POST /auth/login → validates credentials and returns a JWT
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' })
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Email y/o contraseña incorrectos' })
    }

    // Check if the user account is active
    if (!user.activo) {
      return res.status(401).json({ message: 'Tu cuenta está desactivada. Contactá al administrador.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email y/o contraseña incorrectos' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    })

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message })
  }
}

// POST /auth/register → creates a new account with role 'user'
export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'nombre, email y password son obligatorios' })
    }

    // Validate password strength on the backend as well
    // This prevents insecure passwords even if the request is sent directly to the API
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, una minúscula, un número y un carácter especial.'
      })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe una cuenta con ese email' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      role: newUser.role
    })

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message })
  }
}