const mongoose = require("mongoose");
const validator =require('validator');
const bcrypt = require ('bcryptjs');
const userSchema = new mongoose.Schema({
  // name:String
  name: {
    type: String,
    // required:true
    required: [true, "Name is required !!!!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
    lowercase : true  ,
    validate: [validator.isEmail,"email is not valid !!!!"]

  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    required: [true, "password is required !!!!!!!"],
    type: String,
    select: false,
    minlength: 8 

  },

  confirmPassword: {
    required: [true, "password is required !!!!!!!"],
    type: String ,
    select: false ,
    minlength: 8  ,
    validate : {  
        validator : function(cPass){ return cPass==this.password},
        message : "password and confirmPassword does not match "
    },
  },

  age: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },


update_pass_date: {
  type: Date,
  default: Date.now(),
},
});

userSchema.pre("save",async function (next){
   if (!this.isModified("password")) return next()
    this.password=  await bcrypt.hash(this.password ,12);
  this.confirmPassword=undefined ;
  });

userSchema.methods.verifPass= async function (entredPass,cPass){
  return await bcrypt.compare(entredPass,cPass);
};

userSchema.methods.changedPasswordTime = function (JWTiat, pass) {
  return JWTiat > parseInt(pass.getTime() / 1000);

};

userSchema.methods.validTokenDate = function (JWTDate) {
  const dataPass = parseInt(this.update_pass_date.getTime() / 1000);
  return JWTDate < dataPass;
};



const User = mongoose.model("User", userSchema);

module.exports = User;