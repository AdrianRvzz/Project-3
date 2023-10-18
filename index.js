import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'; // You might need to import the path module

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser for URL-encoded data
app.use(bodyParser.json());

// Initialize an empty to-do list
let toDoList = {
    "ExampleCategory": {
        "ExampleTask": 0
    }
};


app.get('/', (req, res) => {
    console.log(toDoList);
    res.render("index.ejs", { toDoList }); // Make sure you have your EJS template engine set up properly
});

app.post('/update', (req, res) => {
    toDoList = req.body.toDoList;
    res.send("ToDo-List updated in server")
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));
