import userModel from "../models/user.model.js";

export const checkUserRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!name || !email || !password)
      return res
        .status(401)
        .send({ message: "All fileds are required!", success: false });
    if (user)
      return res
        .status(400)
        .send({ message: "User Already Exist!", success: false });
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false });
  }
};

export const checksLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).send({ message: "All fileds are required!" });
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not Found!" });
    if (typeof email === "string" || typeof password === "string")
      return res
        .status(401)
        .send({ message: "Enter valid email or password.", success: false });
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false });
  }
};

export const isUserLoggedIn = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else {
      return res.status(401).json({
        message: "Login required",
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PASS);
    req.user = decoded;
    const user = await userModel.findById(decoded.userid);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).send({ message: `User ${user.name} Found`, data: user });
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      message: "Server error",
      error,
    });
  }
};