const express = require('express');
const app = express();


const port$ = process.env.port$ | 5000;
app.listen(port$, ()=>{
    console.log('server started at port ' + port$);
});
app.get('/',(req,res)=>{
    res.send('Express Server at work')    
});

