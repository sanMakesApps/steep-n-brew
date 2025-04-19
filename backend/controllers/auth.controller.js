import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    return { accessToken, refreshToken }
};

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60) //7d
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //XSS attacks prevention, cross-site scripting attack
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict", //prevents CSRF attack, cross-site request forgery
        maxAge: 15 * 60 * 1000, //15min
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //XSS attacks prevention, cross-site scripting attack
        secure: process.env.NODE_ENV == "production",
        sameSite: "strict", //prevents CSRF attack, cross-site request forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    })

}

//SIGNUP
export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });

        }
        const user = await User.create({ name, email, password })


        //authenticate user
        //two different tokens: for 15min and for 7 days
        const { accessToken, refreshToken } = generateTokens(user._id);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    } catch (error) {
        console.log('ERROR IN SIGNUP CONTROLLER ', error.message);
        res.status(500).send({ message: error.message })
    }
}

//LOGIN
export const login = async (req, res) => {

    try {


        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {

            const { accessToken, refreshToken } = generateTokens(user._id);

            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            })
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        console.log('ERROR IN LOGIN CONTROLLER ', error.message);

        res.status(500).json({ message: error.message })
    }
}

//LOGOUT
export const logout = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`)
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: "User logged out successfully" });
    } catch (error) {
        console.log('ERROR IN LOGOUT CONTROLLER ', error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

//To refresh the access token
export const refreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        res.cookie("accessToken", accessToken, {
            httpOnly: true, //XSS attacks prevention, cross-site scripting attack
            secure: process.env.NODE_ENV == "production",
            sameSite: "strict", //prevents CSRF attack, cross-site request forgery
            maxAge: 15 * 60 * 1000, //15min
        });

        res.json({ message: "Token refreshed successfully." })

    } catch (error) {
        console.log('ERROR IN REFRESH TOKEN CONTROLLER ', error.message);
        res.status(500).json({ message: "Server error", error: error.message })

    }
};

//This will get profile.
export const getProfile = async (req, res) => {
    try {
        res.json(req.user);

    } catch (error) {
        console.log("ERROR IN GET PROFILE CONTROLLER ", error.message);
        res.status(500).json({ message: "SERVER ERROR", error: error.message })
    }

}