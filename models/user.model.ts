import { Schema, model, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  comparePassword(plainTextPassword: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  plainTextPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const payload = {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
  };

  const secret = process.env.ACCESS_TOKEN_SECRET || "default_secret";
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || "1h";

  return jwt.sign(payload, secret, { expiresIn });
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
