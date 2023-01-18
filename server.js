"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const apiKey = process.env.API;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (request, response) => {
    response.sendFile(path_1.default.join(__dirname, '..', '/src/index.html'));
});
app.post('/', (request, response) => {
    const query = request.body.query;
    const unit = 'metric';
    const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
    const url = `${endpoint}?q=${query}&units=${unit}&appid=${apiKey}`;
    https_1.default.get(url, (res) => {
        console.log(res.statusCode);
        res.on('data', (data) => {
            const resData = JSON.parse(data);
            console.log(resData);
            if (resData.cod === '404') {
                response.write(`<h1>Search(city) : ${query}</h1>`);
                response.write(`<h2>${resData.message}</h2>`);
            }
            else {
                response.write(`<h1>The weather in ${resData.name} </h1>`);
                response.write(`<h2>${resData.weather[0].main} 
(temp ${resData.main.temp} degrees)</h2>`);
            }
            response.write(`<a href='/'>Back</a>`);
            response.send();
        });
    });
});
app.listen(port, () => {
    console.log(`⚡️[SERVER]: Server is running on port: ${port}`);
});
//# sourceMappingURL=server.js.map