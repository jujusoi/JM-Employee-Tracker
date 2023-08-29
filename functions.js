const classes = require('./classes.js');

const determineType = (type) => {
    console.log(type);
    const chosenClass = classes[type];
    const newClass = new chosenClass();
    newClass.furtherInquiry();
};

module.exports = {
    determineType,
}