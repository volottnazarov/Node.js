const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'countData.json');

// const countOpen = {
//     count: 0
// };

// fs.writeFile(pathToFile, JSON.stringify(countOpen), (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('The file was saved');
//     }
// });

const counters = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));

app.get('/', (req, res) => {
    res.send(`<h1>Мой сайт</h1> <a href="/about">Обо мне</a> <p>Просмотров: ${counters.count}</p>`);
    counters.count ++;
    fs.writeFileSync(pathToFile, JSON.stringify(counters));
});
app.get('/about', (req, res) => {
    res.send(`<h1>Обо мне</h1> <a href="/">Мой сайт</a> <p>Просмотров: ${counters.count}</p>`);
    counters.count ++;
    fs.writeFileSync(pathToFile, JSON.stringify(counters));
});
const port = 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на ${port} порту`);
});
