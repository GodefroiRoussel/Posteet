function getSentence(myArray) {
    var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
    return randomItem
}


module.exports = { getSentence };