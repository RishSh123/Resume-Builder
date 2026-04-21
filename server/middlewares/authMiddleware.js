import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    const token = req.headers.authorization; // after login token is sent in header as "Authorization
    if(!token) {
        return res.status(401).json({ message: "Not Authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next(); // to move to next middleware or controller
    } catch (error) {
        return res.status(401).json({ message: "Not Authorized" });
    }
}

export default protect;
