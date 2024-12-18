const express = require('express');
const joi = require('joi');
const app = express();
const fs = require('fs');
const path = require('path');


/**
 * Создание файла idData.json.
 * Для создания раскоментировать следующий код,
 *  после создания необходимо закоментировать обратно.
 */
const jsonPath = path.join(__dirname, 'idData.json');
// const counterId = {
//     countID: 0
// };
// fs.writeFile(jsonPath, JSON.stringify(counterId), (err) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('The file was saved');
//     }
// });
const countersID = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

/**
 * Валидатор Joi
 */
const userSchema = joi.object({
    firstname: joi.string().min(1).required(),
    secondname: joi.string().min(1).required(),
    age: joi.number().min(0).max(105).required(),
    city: joi.string().min(1)
});

const pathToFile = path.join(__dirname, 'person.json');

app.use(express.json());

/**
 * Роут выводит всех пользователей
 */
app.get('/users', (req, res) => {
    const usersDataJSON = fs.readFileSync(pathToFile, 'utf-8');
    const usersData = JSON.parse(usersDataJSON);
    res.send({ users: usersData });
});

/**
 * Роут выводит пользователя по конкретному ID
 */
app.get('/users/:id', (req, res) => {
    const usersDataJSON = fs.readFileSync(pathToFile, 'utf-8');
    const usersData = JSON.parse(usersDataJSON);
    const userId = +req.params.id;
    const user = usersData.find(user => user.id === userId)
    if(user){
        res.send({ user });
    }else{
        res.status(404);
        console.error('Пользователя с таким Id не существует!');
        res.send({ users: null });
    }
});

/**
 * Роут добавляет нового пользователя с порядковым номером ID
 */
app.post('/users', (req, res) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send({error: result.error.details})
    };
    countersID.countID += 1;
    fs.writeFile(jsonPath, JSON.stringify(countersID), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('ID увеличилось на еденицу');
        }
    });
    const usersDataJSON = fs.readFileSync(pathToFile, 'utf-8');
    const usersData = JSON.parse(usersDataJSON);

    usersData.push({
        //id: uniqueID,
        id: countersID.countID,
        ...req.body
    });
    fs.writeFileSync(pathToFile, JSON.stringify(usersData), null, 2);

    res.send({ id: countersID.countID });
});

/**
 * Роут обновляет информацию о пользователе
 */
app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body);
    if(result.error){
        return res.status(404).send({ error: result.error.details });
    }
    const usersDataJSON = fs.readFileSync(pathToFile, 'utf-8');
    const usersData = JSON.parse(usersDataJSON);
    const userId = +req.params.id;
    const user = usersData.find(user => user.id === userId)
    if(user){
        user.firstname = req.body.firstname;
        user.secondname = req.body.secondname;
        user.age = req.body.age;
        user.city = req.body.city;
        fs.writeFileSync(pathToFile, JSON.stringify(usersData), null, 2);
        res.send({ user });
    }else{
        res.status(404);
        console.error('Пользователя с таким Id не существует!');
        res.send({ user: null });
    }
})

/**
 * Роут удаляет пользователя
 */
app.delete('/users/:id', (req, res) => {
    const usersDataJSON = fs.readFileSync(pathToFile, 'utf-8');
    const usersData = JSON.parse(usersDataJSON);
    const userId = +req.params.id;
    const user = usersData.find(user => user.id === userId)
    console.log(user);
    if(user){
        Object.keys(user).forEach(key => delete user[key]);
        console.log(user);
        fs.writeFileSync(pathToFile, JSON.stringify(usersData));
        res.send({ user });
    }else{
        res.status(404);
        console.error('Пользователя с таким Id не существует!');
        res.send({ user: null });
    }
})

app.listen(3000);