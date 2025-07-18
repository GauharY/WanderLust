const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// username, hashing and salting is automatically created by this npm passport plugin function and also comntains some authenticaten methods too.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);