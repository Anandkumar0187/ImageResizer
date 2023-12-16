const express = require('express');
const mongoose  = require('mongoose');
const sharp = require('sharp');
const app = express();
const port = 8080;
const imageSchema = require('./model/images');
const axios  = require('axios');
const rateLimit = require('express-rate-limit');
const packages  = require('./package.json');

mongoose.connect("mongodb+srv://Anand:Anandkumar@cluster0.wvgskol.mongodb.net/whiteStone").then(()=>{
    console.log('database connected');
})

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
  });
app.use(limiter);

app.get('/api/status',(req,res)=>{
    res.status(200).json({
        packages : Object.keys(packages.dependencies)
    });
})

app.get('/api/process-image',async(req,res)=>{
    try {
        const { url } = req.query;
        const response = await axios.get(url, {responseType : 'arraybuffer'});
        const imageBuffer = Buffer.from(response.data);

        // console.log(imageBuffer);
        const processImage = await sharp(imageBuffer).grayscale().resize(200,200).toBuffer();
        const request = await imageSchema.create({url})

        // console.log(request);
        res.status(200).type('image/jpeg').send(processImage);
    } catch (error) {
        res.send(error);
    }
})
app.listen(port,()=>{
    console.log(`server is listening at ${port}`);
})