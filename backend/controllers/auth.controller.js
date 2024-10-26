import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // create jwt tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: user._id,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "90d" }
    );

    // Create cookie to store refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    // Send accessToken containing email along with name and email
    res.json({ accessToken, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// verify access token and refresh token
export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "2m" }
    );

    res.json({ accessToken });
  });
};

// logout and clear cookies
export const logoutUser = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
