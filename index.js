const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usermodel = require('./models/usermodel');
const foodmodel = require('./models/foodmodel');
const blogModel = require('./models/blogmodel');
const commentmodel = require('./models/commentmodel');
const trackingModel = require('./models/track');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/products')
.then(()=>{
    console.log("data base connection success");
    
})
.catch((err)=>{
    console.log(err);
    
})


// register code



app.post("/register",(req,res)=>{
    let user = req.body
        bcrypt.genSalt(10,(err,salt)=>{
           if (!err)
           {
            bcrypt.hash(user.password,salt,async (err,npass)=>{
                if(!err)
                {
                    user.password =npass
                    try
                    {
                        let doc = await usermodel.create(user)
                        res.status(201).send({message:'user registered'})
                    }
                    catch(err)
                    {
                        console.log(err);
                        res.status(500).send({message:'some problem'})

                    }
                }  
            })
           }
        })
    
})

// login code

app.post("/login",async (req,res)=>{
    let userCread = req.body
    
    try
    {
        const user = await usermodel.findOne({email:userCread.email})
        if(user!== null)
        {
            bcrypt.compare(userCread.password,user.password,(err,success)=>{
                if(success==true)
                {
                    jwt.sign({email:userCread.email},"swamykey",(err,token)=>{
                        if(!err)
                        {
                            res.status(200).send({message:'login success',token:token,userid:user._id,name:user.name})
                            
                        }
                    })
                    
                }
                else
                {
                    res.status(403).send({message:'wrong password'})
                }
            })
        }
        else
        {
            res.send({message:"wrong email"})

        }
    }
    catch(err)
    {
        console.log(err);
        res.status(404).send({message:"some problem"})
        
    }
})


// end point to myntra model


app.get("/foods",verifytoken,async (req,res)=>{
    try
    {
        let foods = await foodmodel.find()
        res.send(foods)

    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({message:"some problem"})
    }
})


function verifytoken(req,res,next)
{
    if(req.headers.authorization!==undefined)
    {
        let token =  req.headers.authorization.split(" ")[1];
        jwt.verify(token,"swamykey",(err,data)=>{
            console.log(data);
            if(!err)
            {
                next();
            }
            else
            {
                res.send({message:"invalid vaild token"})
            }
        })
    }
    else
    {
        res.send({message:'please send the token'})
    }
    
}

// food search code

app.get("/foods/:name",verifytoken, async (req,res)=>{
    try
    {
       let foods = await foodmodel.find({name:{$regex:req.params.name,$options:'i'}})
       res.send(foods)
    //    console.log(foods);
       
    }
    catch
    {
        console.log(err)
        res.status(500).send({message:"food item not found"})
    }
})
// find all blogs
app.get("/allblogs",verifytoken,async(req,res)=>{
    try
    {
        let data = await blogModel.find().populate('userId')
        res.status(201).send(data)
    }
    catch
    {
        res.status(500).send({ message: "some err happened by the gettind the blogs" })
    }
})

// blog code


app.post("/posts", verifytoken, async (req, res) => {
    try {
        let blog = await blogModel.create(req.body);
        res.status(201).send({ message: 'Blog is posted', blog });        
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some database blog problem", err });
    }
});

// find sigleblog

app.get("/singleblog/:id",verifytoken, async(req,res)=>{
    try
    {
        let single = await blogModel.find({userId:req.params.id}).populate("userId")
        res.status(201).send(single)

    }
    catch
    {
        res.status(500).send({ message: "Some database blog problem", err });
    }
})

// delete single blog

app.delete("/deleteone/:id",verifytoken,async (req,res)=>{
    try
    {
        await blogModel.deleteOne({_id:req.params.id}).populate("userId")
        res.status(201).send({message:"delete succesfull"})
    }
    catch
    {
        res.status(500).send({message:"some problem for deleting"})
    }
})

// all user search

app.get("/users",verifytoken, async(req,res)=>{
    try
    {
        let data = await usermodel.find()
        res.send({message:"all users Found",data})

    }
    catch
    {
        res.send({message:"some problem to found the users"})
    }
})


// search single user

app.get("/usersearch/:id",verifytoken, async(req,res)=>{
    try
    {
        let sin = await usermodel.find({name:{$regex:req.params.id,$options:"i"}})
        res.send(sin)

    }
    catch
    {

        res.send({message:"some problem to found the users"})

    }
})


// particular user posts
app.get("/userposts/:id",verifytoken, async(req,res)=>{
    try
    {
        let postOne = await blogModel.find({userId:req.params.id}).populate("userId")
        res.send(postOne)

    }
    catch
    {

        res.send({message:"some problem to get the post"})

    }
})

// search catagory vise

app.get("/search/:name",verifytoken,async(req,res)=>{
    try
    {
        let search = await blogModel.find({category: {$regex:req.params.name,$options:"i"}}).populate("userId")
        res.send(search)
    }
    catch
    {
        res.send({message:"some problem to get the search category"})
    }
})

// update post
app.put("/updatePost/:id", verifytoken, async (req, res) => {
    try {
        let updateResult = await blogModel.updateOne({ _id: req.params.id }, req.body);
            res.status(200).send({ message: "Post updated successfully", updateResult });
        
    } 
    catch
    {
        res.status(500).send({ message: "There was a problem updating the post" });
    }
});

// see your posts 
app.get('/seeposts/:id',verifytoken,async (req,res)=>{
    try
    {
        let myposts = await blogModel.find({_id:req.params.id}).populate('userId')
        res.send(myposts)
    }
    catch
    {
        res.status(500).send({ message: "There was a problem seeing your posts" });
    }
})


// add comment
app.post("/addcomment/:postId", verifytoken, async (req, res) => {
    try {
        let blog = await commentmodel.create(req.body);
        res.status(201).send({ message: 'Blog is posted', blog });        
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some database blog problem", err });
    }
});


// get comment 
app.get('/getall/:postId',verifytoken,async(req,res)=>{
    try
    {
        let Call= await commentmodel.find({postId:req.params.postId}).populate('postId').populate('userId')
        res.status(201).send({ message: "You get All the comments", data:Call })

        

    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({ message: "some err happened" })
    }
})


// Endpoint to track food item
app.post('/track', async (req, res) => {
    const { userId, foodId, details, quantity } = req.body;

    // Validate the required fields
    if (!userId || !foodId || !details || quantity == null) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Create a new tracking entry
        const trackingEntry = new trackingModel({
            userId,
            foodId,
            details,
            quantity,
        });

        await trackingEntry.save();
        res.status(201).json({ message: 'Food item tracked successfully', trackingEntry });
    } catch (error) {
        console.error('Error tracking food item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Endpoint to fetch tracked foods for a user on a specific date
// Server-side code to handle the fetching of food data based on user ID and date
app.get('/track/:userid/:date', async (req, res) => {
    const { userid, date } = req.params;

    try {
        // Parse the incoming date which is expected to be in MM-DD-YYYY format
        const [month, day, year] = date.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day); // Create a Date object

        // Format the date as DD/MM/YYYY to match your database format
        const strDate = `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;

        // Fetch the foods for the given user and date
        const foods = await trackingModel.find({ userId: userid, eatenDate: strDate }).populate('userId');

        if (foods.length === 0) {
            return res.status(404).send({ message: 'No foods found for the given date' });
        }

        // Send the foods as a response
        res.send(foods);
    } catch (err) {
        // Log and return an error message
        console.error('Error fetching foods:', err);
        res.status(500).send({ message: 'Some problem in getting the food', error: err.message });
    }
});






app.listen(9000,()=>{
    console.log('server running')
})