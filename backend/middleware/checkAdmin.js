module.exports = function (req, res, next) {
    // Vérifier si l'utilisateur a le rôle d'admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next(); // Continuer vers la route si l'utilisateur est admin
  };
  