const express = require("express");
const zod = require("zod");
const User = require('../db')
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../config');

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

// user signup route
router.post('/signup', async(req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);

    if(!success) {
        res.status(411).json({
            msg: "Email already taken/ Incorrect inputs"
        });
    }
    try {

    const existingUser = User.findOne({
            username: body.username
    });
       
      if(existingUser._id) {
        res.status(201).send({
            msg: "User already exists"
        });
      } else {

        const newUser = await User.create(body);
        const token = jwt.sign({
            userId: newUser._id
        }, JWT_SECRET)

        res.json({
            msg: "User created successfully",
            token: token
        })
      }

    } catch (error) {
        res.status(411).json({
            error: "signup failed. please try again later"
        })
    }
});


// user signin route
const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

const {success} = signinSchema.safeParse(req.body);

    if(!success) {
        res.status(411).json({
            msg: "Incorrect inputs"
        });
    }

    router.post('/signin', async(req, res) => {
    const body = req.body({
        username,
        password
    });
  
    const user = await User.findOne({
        username: body.username
    })

   try {
    if(!user) {
       res.status(404).send({
        msg: "User not found"
       });
    } else {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.status(200).json({
            token: token
        })
    }
 } catch (error) {
     res.status(411).json({
        msg: "Error logging in"
     })
   }

});

module.exports = router;