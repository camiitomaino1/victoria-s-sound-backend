// Middleware factory that receives allowed roles and returns a middleware function
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
  
      // req.user is set by verifyToken middleware
      // If req.user is missing, verifyToken was not applied before this middleware
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' })
      }
  
      // Check if the user role is included in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: 'No tenés permisos para realizar esta acción'
        })
      }
  
      // Role is allowed, continue to the next middleware or controller
      next()
    }
  }