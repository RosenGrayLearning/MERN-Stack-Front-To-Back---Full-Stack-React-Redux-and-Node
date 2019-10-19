const express = require('express'),
      app = express(),
      connectDB = require('./config/db'),
      PORT = process.env.PORT || 5000,
      apiRoutes = ['users','auth','profile','posts'];


//Connect To Database
connectDB();

//Init Middleare
app.use(express.json({
    extended:false
}));

app.get('/',(req,res,next)=>{
    res.send('api runnig');
})

apiRoutes.forEach(apiRoute =>{
    //Define Routes
     app.use(`/api/${apiRoute}`, require(`./routes/api/${apiRoute}`));
})

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
});
