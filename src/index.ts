import express from 'express';
import dotenv from 'dotenv';
import identifyRouter from "./routes/identify";

dotenv.config();

const app = express();
const Port = process.env.PORT;

app.use(express.json());

app.get('/', (req,res)=>{
    res.json('Hello world')
});

app.use('/identify', identifyRouter);

app.listen(Port, ()=>console.log(`Express Typescript server is running over http://localhost:${Port}`));