import bcrypt, { hash } from 'bcrypt';
import { client } from '../index.js';



export async function generateHashedPassword(password){
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    console.log(salt);
    return(hashedPassword);
}
// generateHashedpassword("password@123");

//db.users.insertOne(data);
export async function CreateUser(data){
    return await client.db("signup").collection("userslist").insertOne(data);
}

export async function getUserByName(username){
    return await client.db("signup").collection("userslist").findOne({ username: username });
}
