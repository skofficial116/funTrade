import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired' 
      });
    }
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Not authorized as an admin' 
    });
  }
};
