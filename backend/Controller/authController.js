const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");


const createToken=(name,id )=>
    {
         return jwt.sign({name,id }, 
        process.env.SECRET_KEY,
        {expiresIn: "30d"

         })
    }
exports.signup = async (req, res) => {
    try {
        const { name,email,role,password,confirmPassword,age}= req.body
        console.log("create ");
        const newUser = await User.create({
        
        name , 
        email,
        role,
        password ,
        confirmPassword,
        age 
    });
      res.status(201).json({
        status: "success",
        data: { newUser },
      });
    } catch (err) {
      res.status(400).json({
        status: "fail ",
        message: err,
      });
    }
  };
  
exports.login = async (req, res) => {
    try {
        const{ email,password}=req.body
        if (!email || !password )
            {return res.status(400).json({
                status: "fail",
                message: "email and password are required "
            })
            }
            const user =await  User.findOne({email}).select("+password") ;  // forcer la select du mot de passe 
       if (!user || ! user.verifPass(password,user.password)) 
              return res.status(400).json({
               status: "fail",
                 message: "email or  password incorrect "
              });

              const token =  createToken(user.name,user._id) ;
res.status(200).json({
    status : "success",
    message: "logged in " ,
    token ,
    data : {user},


});
}
 catch (err) {
      res.status(400).json({
        status: "fail   hkjhkjhjhhjlhjh",
        message: err,
      });
    }
  };
  exports.protectionMW = async (req, res, next) => {
    try {
      let token;
      // 1) thabat si el user connecter ou bien non
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return res.status(401).json({
          status: "fail",
          message: "you have to be logged in !!!!",
        });
      }
      // 2) thabat si el token valid ou bien lé
  
      let myToken = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
      console.log(myToken);
  
      // 3) thabat el user mizel mawjoub ou bien lé
      const myUser = await User.findById(myToken.id);
      if (!myUser) {
        return res.status(401).json({
          status: "fail",
          message: "User is no longer exists !!!!",
        });
      }
      // 4) thabt si el user badal el pass mte3ou ba3d ma sna3 el token ou bien lé
  
      if (myUser.validTokenDate(myToken.iat)) {
        return res.status(401).json({
          status: "fail",
          message: "token no longer valid !!!!",
        });
      }
      req.user = myUser;
      next();
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  };
  
  exports.howCanDo = (...roles) => {
    return async (req, res, next) => {
      try {
        console.log(roles);
        if (!roles.includes(req.user.role)) {
          return res.status(401).json({
            status: "fail",
            message: "you can not do this !!!!",
          });
        }
        next();
      } catch (error) {
        res.status(400).json({
          status: "fail",
          message: error,
        });
      }
    };
  };