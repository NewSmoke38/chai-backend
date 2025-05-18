import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"           // we will use "pre" middleware here

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true

    },

    avatar: {
      type: String,    // cloudinary url use krenge
      required: true
    },

    coverImage: {
      type: String, // cloudinary url use
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    refreshToken: {
      type: String,
    }

  },

  {
    timestamps: true
  }
)

// pre
// to make the password encrypted but only one time at sign up or when updating the password
// so we use a conditon
userSchema.pre("save", async function (next) {        // async is for the time it takes, bro its cryptography hehe
  if (!this.isModified("password")) return next();     // yaha we checked for negative
  // modify hua hai toh we will encrypt it!! 
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



// some methods

// this one it to check if the password is correct

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// JWT token generation methods
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)