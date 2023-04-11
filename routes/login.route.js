import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserByName } from '../services/service.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//Login API - POST -Create
router.post('/user', async function (request, response) {
    const { username, password } = request.body;

    const userFromDB = await getUserByName(username);
    console.log(userFromDB);

    if(!userFromDB){
        response.status(401).send({ message: "Invalid Credentials"});
    } else {
        const storedDBPassword = userFromDB.password;
        const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
        console.log(isPasswordCheck);

        if(isPasswordCheck){
            const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
            response.send({ message: "Successfull login", token: token});
        } else {
            response.status(401).send({ message: "Invalid Credentials"});
        }
    }
});


export default router;