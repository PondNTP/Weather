import express, { response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import https from 'https';
import { IncomingMessage } from 'http';
import path from 'path';

dotenv.config()
const app = express()
const port = process.env.PORT
const apiKey = process.env.API

app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (request: express.Request, response: express.Response) => {
    response.sendFile(path.join(__dirname, '..', '/src/index.html'))
})

app.post('/', (request: express.Request, response: express.Response) => {
    const query = request.body.query
    const unit = 'metric'
    const endpoint = 'https://api.openweathermap.org/data/2.5/weather'
    const url = `${endpoint}?q=${query}&units=${unit}&appid=${apiKey}`
    https.get(url, (res: IncomingMessage) => {
        console.log(res.statusCode)
        res.on('data', (data) => {
            const resData = JSON.parse(data)
            console.log(resData)
            if (resData.cod === '404') {
                response.write(`<h1>Search(city) : ${query}</h1>`)
                response.write(`<h2>${resData.message}</h2>`)
            } else {
                response.write(`<h1>The weather in ${resData.name} </h1>`)
                response.write(`<h2>${resData.weather[0].main} 
(temp ${resData.main.temp} degrees)</h2>`)
            }
            response.write(`<a href='/'>Back</a>`)
            response.send()
        })
    })
})

app.listen(port, () => {
    console.log(`⚡️[SERVER]: Server is running on port: ${port}`)
})
