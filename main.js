var words = require("an-array-of-english-words");

wordleWords = words.filter((itm) => itm.length === 5);

localStorage.setItem("wordleWords", JSON.stringify(wordleWords));
