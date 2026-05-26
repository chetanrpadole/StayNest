import mongoose from "mongoose";
import PassportLocalMongoose from "passport-local-mongoose";
const passportLocalMongoose = PassportLocalMongoose.default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
});

// passport-local-mongoose automatically adds username & password (hashed) fields
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;
