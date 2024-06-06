const express = require("express");
const zod = require("zod");
const { User, Account } = require('../db')
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../config');
const authMiddleware = require('../middleware');

const router = express.Router();


// USER SIGNUP
const signupSchema = zod.object({
    username: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

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

        // create new account
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
      })

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


// USER SIGNIN 
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

    router.post('/signin', async(req, res) => {
        
    const {success} = signinSchema.safeParse(req.body);
    if(!success) {
    res.status(411).json({
        msg: "Incorrect inputs"
       });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
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

// UPDATE USER INFORMATION
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put('/', authMiddleware, async(req, res) => {
      const {success} = updateBody.safeParse(req.body)

      try {
        if(!success) {
            res.status(411).json({
                msg: "Error while updating"
            })
          };

          await User.updateOne(req.body, {
            id: req.userId
          });
    
          res.json({
            msg: "Updated successfully!"
          });
      } catch (error) {
        res.status(411).json({
                msg: "Error while updating. Try again later"
            })
      };
     
});

// SEARCH/FILTER USERS

router.get('/bulk', async(req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });

});


module.exports = router;