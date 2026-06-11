import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, 
      trim: true,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: false,
      trim:true, 
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function(next){
if(!this.isModified("password")) return next();
this.password=await bcrypt.hash(this.password,12)
next();
})

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Admin", adminSchema); 