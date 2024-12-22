import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, unique: true },
  role: { type: String, enum: ['seeker', 'recruiter','admin'], required: true },
  company: { type: String, required: function () { return this.role === 'recruiter'; } },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // New field for profile picture
  isActive: { type: Boolean, default: true }, // New field to track active status

});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
