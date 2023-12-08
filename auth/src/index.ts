import express from 'express';
import {json} from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentUser', (req,res) => {
    res.send("RESPODSFOIHDSOFIHDSOFHI ");
})

app.listen(3000, ()=> {
    console.log("Listining on port 3000!");
    console.log("New console log 2");
})