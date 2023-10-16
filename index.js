const express = require('express');
//Imports the data from the MOCK_DATA.json 
//file as a JavaScript object or array, 
//not as a JSON string. When you use require in this manner to import a JSON file, Node.js automatically parses the JSON data,
// and you can work with it as a JavaScript object or array.

const users = require('./MOCK_DATA.json')
const fs = require('fs');
// creating an instance
const app = express()

//Routes

//middleware - plugin to resolve the request body
app.use(express.urlencoded({extended: false}))

app.get('/users', (req, res)=>{
    const html = `
    <ul>
      ${users.map(user => `<li>
      ${user.first_name}
      </li>`)}
    </ul>
 `
 res.send(html)
})

app.get("/api/users", (req, res) =>{
    // It is a good practice to add a custom header with naming conention X- "----"
    res.setHeader("X-MyName", "Abhishek")
     res.json(users)
})

app.get("/api/users/:id", (req, res) =>{
    const id = Number(req.params.id);

    const user = users.find((user) => user.id===id);
    return res.json(user);
})

app.post("/api/users", (req, res)=>{
    const body = req.body;
    users.push({...body, id:users.length+1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({status: "success", id:users.length})
    })
})
.patch("/api/users", (req, res)=>{
    const body = req.body;
    const patched_users = users.filter((obj)=>{
        if(obj.id===body.id){
            return {...obj, first_name:body.first_name}
        }
        return obj;
    })

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(patched_users), (err, data)=>{
        return res.json({status: "success"})
    })
})
.delete("/api/users", (req, res)=>{
   const body = req.body;
   const updated_users = users.filter(obj=> obj.id !==body.id)
   fs.writeFile('./MOCK_DATA.json', JSON.stringify(updated_users), (err, data)=>{
    return res.json({status: "success"})
})
})

/*fs.writeFile is a method provided by Node.js for writing data to a file.
 It expects the data to be written as a string. This means that you need to convert your JavaScript object
  (or array in this case) into a string format to write it to the file.
*/

/* fs.writeFile function in Node.js, it will override the
 entire content of the file with the new data you specify.*/
const PORT = 8000;

app.listen(PORT, ()=>console.log(`Server Started at PORT:${PORT} `))

