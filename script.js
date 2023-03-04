var currentElement;
var siblingElement;

const controlDiv = document.querySelector(".control-div");

const wordleWords = JSON.parse(localStorage.getItem("wordleWords"));

const currentWord =
    wordleWords[Math.floor(Math.random() * wordleWords.length)].toUpperCase();

const firstInput = document.querySelector("input");
firstInput.focus();

function limitInput(ele) {
    ele.value = ele.value.toUpperCase();

    if (ele.value.length > 1) {
        ele.value = ele.value.substr(0, 1);
    }

    currentElement = document.activeElement;
    siblingElement = currentElement.nextElementSibling;

    //13 for enter
    //8 for backspace

    if (ele.value.length != 0) {
        if (siblingElement) {
            siblingElement.focus();
        } else {
            // const parent = currentElement.parentElement;
            // const uncle = parent.nextElementSibling;
            // const cousin = uncle.firstElementChild;
            // cousin.focus();
        }
    }
}

document.onkeydown = (evt) => {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);

    console.log(charCode);

    //for backspace
    if (charCode == 8) {
        const currentElement = document.activeElement;
        if ((currentElement.nodeName = "input")) {
            currentElement.value = "";

            if (currentElement.previousElementSibling) {
                currentElement.style.backgroundColor = "";
                currentElement.style.color = "";
                const sibling = currentElement.previousElementSibling;
                sibling.focus();
            } else {
                currentElement.style.backgroundColor = "";
                currentElement.style.color = "";
            }
        }
    }

    if (charCode == 13 || charCode == 229) {
        const currentElement = document.activeElement;
        const currentParent = document.activeElement.parentElement;
        const currentChilds = currentParent.children;

        var emptyChildArr = Array.from(currentChilds);

        emptyChildArr = emptyChildArr.filter((ele) => ele.value.length === 0);

        if (!currentElement.nextElementSibling && emptyChildArr.length === 0) {
            const uncle = currentParent.nextElementSibling;
            const cousin = uncle ? uncle.firstElementChild : null;
            if (cousin !== null) {
                cousin.focus();
            }
            evaluateLine(currentParent);
        }
    }
};

function evaluateLine(parent) {
    const childElements = Array.from(parent.children);

    var guessword = "";
    childElements.forEach((ele) => {
        guessword += ele.value;
    });

    if (wordleWords.includes(guessword.toLocaleLowerCase()) === false) {
        const childElements = Array.from(parent.children);

        childElements.forEach((ele) => {
            ele.value = "";
        });

        childElements[0].focus();

        alert("Not a valid word :(");
        // window.location.reload();
    } else {
        //i for current word
        //yellow #B59F3B rgb(181, 159, 59)
        //green #538D4E rgb(83, 141, 78)
        for (i = 0; i < currentWord.length; i++) {
            for (j = 0; j < guessword.length; j++) {
                if (currentWord.charAt(i) === guessword.charAt(j)) {
                    if (i === j) {
                        const element = childElements[j];
                        element.style.backgroundColor = "#538D4E";
                        element.style.color = "white";
                    } else {
                        const element = childElements[j];
                        if (
                            element.style.backgroundColor !== "rgb(83, 141, 78)"
                        ) {
                            element.style.backgroundColor = "#B59F3B";
                            element.style.color = "white";
                        }
                    }
                } else {
                    const element = childElements[j];
                    if (element.style.backgroundColor == "") {
                        element.style.backgroundColor = "#3A3A3C";
                        element.style.color = "white";
                    }
                }
            }
        }

        //checking duplicates

        var guessCharCount = {};
        var currentCharCount = {};

        const guessCharArray = Array.from(guessword);
        guessCharArray.forEach((itm) => {
            guessCharCount = {
                ...guessCharCount,
                [itm]: guessCharArray.filter((x) => x === itm).length,
            };
        });

        const currentCharArray = Array.from(currentWord);
        currentCharArray.forEach((itm) => {
            currentCharCount = {
                ...currentCharCount,
                [itm]: currentCharArray.filter((x) => x === itm).length,
            };
        });

        childElements.forEach((ele) => {
            if (ele.style.backgroundColor === "rgb(181, 159, 59)") {
                const guessValueCount = guessCharCount[ele.value];
                const currentValueCount = currentCharCount[ele.value];
                if (guessValueCount > currentValueCount) {
                    const allOccurenceArray = getAllIndexes(
                        guessCharArray,
                        ele.value
                    );

                    console.log(allOccurenceArray);

                    const diff = guessValueCount - currentValueCount;
                    console.log(diff);
                    for (
                        i = allOccurenceArray.length - 1;
                        i >= allOccurenceArray.length - diff;
                        i--
                    ) {
                        childElements[
                            allOccurenceArray[i]
                        ].style.backgroundColor = "#3A3A3C";
                        childElements[allOccurenceArray[i]].style.color =
                            "white";
                    }
                }
            }
        });

        if (guessword === currentWord || parent.nextElementSibling === null) {
            if (guessword === currentWord) {
                gameEnd(true);
            } else {
                gameEnd(false);
            }
        }
    }
}

function gameEnd(result) {
    controlDiv.focus();

    const msg = result ? "Well Done!!!" : "Better luck next time :)";

    const endSection = `
        <h2>${msg}</h2>
        <button type="button" class="btn btn-outline-primary">
            Try Again?
        </button>`;

    const mainElement = document.querySelector("main");
    const section = document.createElement("section");
    section.className =
        "end-sec d-flex flex-row gap-3 justify-content-center align-items-center mt-3";

    if (!document.querySelector(".end-sec")) {
        const title = document.querySelector(".title-text");
        title.textContent = `The word was "${currentWord}"`;
        section.innerHTML = endSection;
    }

    section.onclick = () => {
        const inputArr = Array.from(document.querySelectorAll("input"));
        inputArr.forEach((ele) => {
            ele.value = "";
            ele.style.backgroundColor = "";
            ele.style.color = "";
        });
        const temp = inputArr[0];
        temp.focus();
        removeSection(section);
        window.location.reload();
    };

    mainElement.appendChild(section);
}

function removeSection(ele) {
    const parent = ele.parentElement;
    parent.removeChild(ele);
}

function getAllIndexes(arr, ele) {
    var indices = [];
    var idx = arr.indexOf(ele);
    while (idx != -1) {
        indices.push(idx);
        idx = arr.indexOf(ele, idx + 1);
    }
    return indices;
}
