const express = require('express'),
      app = express();

const PORT = process.env.PORT || 5000;

app.get('/',(req,res,next)=>{
    res.send('api runnig');
})

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
});