import express from 'express';
import { CreateUser, generateHashedPassword, getUserByName } from '../services/service.js';



const router = express.Router();

//Signup - API - POST request - Create
router.post("/user", async function (request, response) {
    const { username, password } = request.body;
    //db.users.insertOne(data);

    const userFromDB = await getUserByName(username);
    console.log(userFromDB);

    if(userFromDB){
        response.status(400).send({ message: "Username already exists" });
    } else if (password.length < 8) {
        response.status(400).send({ message: "Password must be atleast 8 characters" });
    } else {
        const hashedPassword = await generateHashedPassword(password);
        const result = await CreateUser({
            username : username,
            password : hashedPassword,
        });
        response.send(result);
    }
});

export default router;
