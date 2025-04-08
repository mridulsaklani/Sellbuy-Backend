const authController = async (req, res) => {
    try {
        return res.status(200).json({ isAuthenticated: true, user: req.user });
    } catch (error) {
        console.error("Auth Controller Error:", error);
        res.status(500).json({ message: "Error from auth controller" });
    }
};

module.exports = authController;
