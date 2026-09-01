import jwt from 'jsonwebtoken';
import { dbGet } from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'nishanth_portfolio_secure_jwt_secret_key_2026';

export const verifyAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token required.'
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Look up user in database
    const user = await dbGet('SELECT id, username, email, role FROM admin_users WHERE id = ?', [decoded.id]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User no longer exists.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.'
    });
  }
};