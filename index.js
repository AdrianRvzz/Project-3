import express from "express"
const app = express()
const port = 3000

app.use(express.static("public"))

app.get('/', (req, res) => {

    console.log(getCurrentDate())
    let currentDate = getCurrentDate()
    res.render("index.ejs",{currentDate, toDoList})
}


)

function getCurrentDate(){
    let today = new Date();
    return {
        dayOfWeek: new Intl.DateTimeFormat(undefined, {weekday:"long"}).format(today).slice(0,3),
        day: today.getDate(),
        month: new Intl.DateTimeFormat(undefined, {month:"long"}).format(today).slice(0,3),
        year: today.getFullYear()
    }
}

let toDoList={
    "Work":{
        "Send progress":0,
        "Send progress 2":1
    },
    "School":{
        "Send homework":0,
        "Send project to teacher akjdshkjashdjk":1
    }
    
}





app.listen(port, () => console.log(`Example app listening on port ${port}!`))