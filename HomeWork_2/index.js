function magicBall() {
    return Math.floor(Math.random() * 2) === 0 ? "Да" : "Нет";
};


module.exports = { magicBall };