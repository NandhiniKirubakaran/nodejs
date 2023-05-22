import express from 'express';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import loginRouter from './routes/login.route.js';
import signupRouter from './routes/signup.route.js';
import Stripe from 'stripe';
import {v4 as uuidv4} from 'uuid';


const app = express();

//env - Environment variables
console.log(process.env.MONGO_URL);

// const PORT = 4000;
const PORT = process.env.PORT;                  //Auto assign PORT

app.get('/', function ( request, response) {
    response.send("HI,🎉🎉🎉🎉");
});

//Connection code - Mongodb
// const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_URL = process.env.MONGO_URL;        //default ip of mongo 
const client = new MongoClient(MONGO_URL);      //dial
await client.connect();                         //Top level await      //call
console.log("Mongo is Connected!!!");

// xml json text
// middleware - express.json() - JSON -> JS object
// app.use -> Intercepts -> applies express.json()
app.use(express.json());
app.use(cors());

app.use("/login", loginRouter);
app.use('/signup', signupRouter);

//Mobiles - POST - Create
app.post('/mobiles', async (request, response) => {
    const data = request.body;
    //db.mobiles.insertMany(data);
    const result = await client.db("signup").collection("mobiles").insertMany(data);
    response.send(result);
});

//GET- all mobiles
app.get('/mobiles', async (request, response) => {
    // const data = request.body;
    //db.mobiles.insertMany(data);
    const result = await client.db("signup").collection("mobiles").find({}).toArray();
    response.send(result);
});

//GET- mobiles by id
app.get('/mobiles/:id', async (request, response) => {
    const {id} = request.params;
    const result = await client.db("signup").collection("mobiles").findOne({ id: id});
    response.send(result);
});


const SECRET_KEY_1 = process.env.SECRET_KEY_1;

const stripe = new Stripe(SECRET_KEY_1);

app.get('/payment', async (req, res) => {
    const { mobile, token } = req.body;
    const transactionkey = uuidv4();
    return stripe.customers.create({
        email: token.email,
        source: token.id,
    }).then((customer) => {
        stripe.charges.create({
            amount: mobile.price,
            customer: customer.id,
            receipt_email: mobile.model,
        }).then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
        });
    });
});



app.listen(PORT, () => console.log(`The Server Started in : ${PORT} 🎊`));

export { client };