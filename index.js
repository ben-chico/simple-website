require('dotenv').config();
const express = require('express');
const app = express();
const PORT  = process.env.PORT;
const dbConnect = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeAdminRoutes = require('./routes/home-admin-routes');
const imageRoutes = require('./routes/image-routes');



//database connection
dbConnect();


//middlewares
app.use(express.json({limit: '5mb'}));
app.use('/api/auth', authRoutes);
app.use('/api/page', homeAdminRoutes);
app.use('/api/images', imageRoutes);



//run server
app.listen(PORT, ()=>{
    console.log("server is running✅");
})