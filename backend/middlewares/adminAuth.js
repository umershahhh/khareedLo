
const adminAuth = (req, res, next) => {
  console.log("Admin authorization middleware reached");
  console.log("Authenticated user role:", req.user?.role);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};

module.exports = { adminAuth };
