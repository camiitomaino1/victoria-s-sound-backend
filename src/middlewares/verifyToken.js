import jwt from 'jsonwebtoken'

// Secret key used to verify the JWT (must match the one used in auth.controller.js)
const JWT_SECRET = 'victoriassound_secret_key'

// Middleware to verify the JWT token from the Authorization header
export const verifyToken = (req, res, next) => {

  // Read the Authorization header from the request
  const authHeader = req.headers['authorization']

  // If the header is missing, the user is not authenticated
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  // The header format must be "Bearer TOKEN"
  // Split by space and take the second part (the token itself)
  const token = authHeader.split(' ')[1]

  // If the token part is missing after splitting, return 401
  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido' })
  }

  try {
    // Verify the token using the secret key
    // If valid, decoded contains the payload: { id, role, iat, exp }
    const decoded = jwt.verify(token, JWT_SECRET)

    // Attach the decoded payload to req.user so controllers can access it
    req.user = decoded

    // Continue to the next middleware or controller
    next()

  } catch (error) {
    // The token exists but is invalid or expired
    return res.status(403).json({ message: 'Token inválido o expirado' })
  }
}