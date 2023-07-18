
require('dotenv').config();


const express = require('express');
const bodyparser= require('body-parser');
const mongoose =require ('mongoose');
const date= require(__dirname + "/date.js");
const _ = require('lodash');
const app= express();

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));// parse the encoded url 
app.use(express.static('public'));

                                //connecting the database                             
const connectDb= async()=>
{
    try
    {
        const con =await mongoose.connect(process.env.MONGO_URI);
        console.log("connected: ${con.connection.host}");
    }
    catch(error)
    {
        console.log(error);
    }
}

const PORT = process.env.PORT || 3000; // Use port 3000 as default if PORT environment variable is not set

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
                                //defining the schema
const NewSchema= new mongoose.Schema
(
    {
        task: String
    }
);


                                //creating model or collection 
let doc;
let lists;
let parameter

let myday=date.getdate();


                                // rendering the ejs templet
app.get("/todo/:value",  async function(req, res)
{    
    parameter=_.lowerCase(req.params.value);
    console.log(parameter);

    doc = new mongoose.model( parameter, NewSchema);

    try {
        const listItems = await doc.find();
         lists = listItems;
        // const value=await finder(); // Call finder() and wait for the result
        console.log(value);
        res.render('index', { name: myday, newlists: lists });
      } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.send('Error fetching data from the database');
      }
});

// async function finder() {
//     try {
//         const listItems = await doc.find();
//       lists = listItems;
      
//     } catch (error) {
//       console.error('Error fetching data from the database:', error);
//       throw error; // Rethrow the error to be caught by the calling function
//     }
//   }


                                //inserting the value in the database
app.post('/', function(request, response)
{
        const TodoValue={
            task: request.body.task
        }


    try
    {
        doc.create(TodoValue);
        response.redirect("/todo/"+parameter);
    }
    catch(error)
    {
        console.log("values not inserted");
       
    }

    
    // if (request.body.list===request.body.list)
    // {
    //     let item= request.body.listname;
    //     work.push(item);
    //     response.redirect('/work');
    //     console.log(work, request.body.list);
    // }
    // else
    // {
    //     let item= request.body.listname;

    //     list.push(item);
    //     response.redirect('/');
    //     console.log(list);
    // }
}
);


                                                //update
app.post('/update', async function(request, response)
{
    const id=request.body.id;
    console.log(id);
        const TodoValue={
            $set:{task: request.body.task}
        }

    try
    {

        await doc.updateOne({_id:id} ,TodoValue);
        console.log("inserted");
        response.redirect("/todo/"+parameter);
    }
    catch(error)
    {
        console.log(error);
        
    }  
});

           
 
                                            //Delete

app.get('/delete', async function(req, res)
{
     const id= req.query.id;
    
     (async()=>
     {
        try
        {
            await doc.deleteOne({_id: id});
            res.redirect("/todo/"+parameter);
        }
        catch(err)
        {
            console.log(err);
        }
      })();

})

                                            //edit value
app.get('/edit', async function(req, res)
{
     const id= req.query.id;
    
     (async()=>
     {
        try
        {
            const editValue =await doc.find({_id: id});
            res.render('edit', { name: myday, editlists: editValue, newlists:lists });
        }
        catch(err)
        {
            console.log(err);
        }
      })();

})




// app.get("/work", function(req, res)
// {  
//     res.render('work', {name: myday, newlists: work});
// });


// app.post('/submit', function(request, response)
// {
//     var item= request.body.listname;

//     work.push(item);
//     response.redirect('/work');
//     console.log(work);
// }
// );


// app.listen(8000);
