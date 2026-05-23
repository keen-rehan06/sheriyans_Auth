import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    try {
          if (!user) {
        throw new Error("User not found");
    }

    return jwt.sign(
        { userid: user._id },
        process.env.JWT_SECRET,
        {expiresIn:'2d'}
    );
    } catch (error) {
        res.status(401).send({message:"Token Generation Failed!",error})
    }
}

export const generateAccessToken = (user) => {
    try {
        if(!user) {
            throw new Error("User Not Found!")
        }
        return jwt.sign({userid:user._id},process.env.ACCESS_TOKEN_PASS,{expiresIn:'30s'});
    } catch (error) {
        res.status(401).send({message:"AccessToken Generation Failed!",error})
    }
}

export const generateRefreshToken = (user) => {
    try {
        if(!user) throw new Error("User Not Found!");
        return jwt.sign({userid:user._id},process.env.REFRESH_TOKEN_PASS,{expiresIn:'30d'})
    } catch (error) {
        res.status(401).send({message:"RefreshToken Generation Failed!",error})
    }
}