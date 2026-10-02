let currentInput = "";

let expression = "";

let previousAnswer = 0;

let memory = 0;

let angleMode = "DEG";

let secondMode = false;

const display =
    document.getElementById("display");

const expressionDisplay =
    document.getElementById("expression");

const modeButton =
    document.getElementById("modeButton");
function updateDisplay() {

    if (currentInput === "") {
        display.textContent = "0";
    } else {
        display.textContent = currentInput;
    }
}

function addNumber(number) {
    currentInput += number;
    updateDisplay();
}

function addDecimal() {

    let parts =
        currentInput.split(/[\+\-\*\/\^]/);

    let lastNumber =
        parts[parts.length - 1];


    if (!lastNumber.includes(".")) {
        currentInput += ".";
        updateDisplay();
    }
}

function addOperator(operator) {

    if (currentInput === "") {
        return;
    }

    let lastCharacter =
        currentInput.slice(-1);

    if (
        lastCharacter === "+" ||
        lastCharacter === "-" ||
        lastCharacter === "*" ||
        lastCharacter === "/" ||
        lastCharacter === "^"
    ) {
        currentInput =
            currentInput.slice(0, -1);
    }

    currentInput += operator;
    updateDisplay();
}

function addParenthesis(parenthesis) {

    currentInput += parenthesis;
    updateDisplay();
}

function deleteLast() {

    currentInput =
        currentInput.slice(0, -1);
    updateDisplay();
}

function clearCalculator() {
    currentInput = "";
    expression = "";
    expressionDisplay.textContent = "";
    updateDisplay();
}

function changeAngleMode() {

    if (angleMode === "DEG") {
        angleMode = "RAD";
    } else {
        angleMode = "DEG";
    }
    modeButton.textContent = angleMode;
}

function toggleSecond() {

    secondMode = !secondMode;
    if (secondMode) {
        alert("2nd mode ON");
    } else {
        alert("2nd mode OFF");
    }
}

function insertConstant(type) {

    if (type === "pi") {
        currentInput += Math.PI;
    }

    else if (type === "e") {
        currentInput += Math.E;
    }
    updateDisplay();
}

function useAnswer() {
    currentInput += previousAnswer;
    updateDisplay();
}

function toggleSign() {
    if (currentInput === "") {
        return;
    }


    let number =
        parseFloat(currentInput);

    if (!isNaN(number)) {
        currentInput =
            String(number * -1);
        updateDisplay();
    }
}

function scientificFunction(functionName) {

    if (currentInput === "") {
        return;
    }

    let number =
        evaluateExpression(currentInput);
    if (isNaN(number)) {
        showError();
        return;
    }

    let answer;
   
    if (functionName === "sqrt") {

        if (number < 0) {
            showError();
            return;
        }
        answer = Math.sqrt(number);
    }

    else if (functionName === "square") {
        answer = number * number;
    }

    else if (functionName === "cube") {
        answer = number * number * number;
    }

    else if (functionName === "sin") {

        let angle =
            convertToRadians(number);
        answer = Math.sin(angle);
    }

    else if (functionName === "cos") {

        let angle =
            convertToRadians(number);
        answer = Math.cos(angle);
    }

    else if (functionName === "tan") {

        let angle =
            convertToRadians(number);
        answer = Math.tan(angle);
    }

    else if (functionName === "log") {

        if (number <= 0) {
            showError();
            return;
        }
        answer = Math.log10(number);
    }

    else if (functionName === "ln") {

        if (number <= 0) {
            showError();
            return;
        }
        answer = Math.log(number);
    }

    else if (functionName === "factorial") {

        if (
            number < 0 ||
            !Number.isInteger(number)
        ) {
            showError();
            return;
        }
        answer = factorial(number);
    }

    else if (functionName === "inverse") {

        if (number === 0) {
            showError();
            return;
        }
        answer = 1 / number;
    }

    else if (functionName === "tenPower") {
        answer = Math.pow(10, number);
    }

    else if (functionName === "exp") {
        answer = Math.exp(number);
    }
    currentInput =
        formatNumber(answer);
    updateDisplay();
}

function factorial(number) {

    let result = 1;
    for (let i = 1; i <= number; i++) {
        result *= i;
    }
    return result;
}

function convertToRadians(number) {

    if (angleMode === "DEG") {

        return number * Math.PI / 180;
    }
    return number;
}

function convertFromRadians(number) {
    if (angleMode === "DEG") {
        return number * 180 / Math.PI;
    }
    return number;
}

function calculatePercentage() {

    if (currentInput === "") {
        return;
    }

    let number =
        evaluateExpression(currentInput);

    if (!isNaN(number)) {
        currentInput =
            formatNumber(number / 100);
        updateDisplay();
    }
}

function calculate() {
    if (currentInput === "") {
        return;
    }

    expressionDisplay.textContent =
        currentInput;

    let answer =
        evaluateExpression(currentInput);
    if (isNaN(answer)) {
        showError();
        return;
    }
    previousAnswer = answer;
    currentInput =
        formatNumber(answer);
    updateDisplay();
}

function evaluateExpression(input) {

    let tokens =
        tokenize(input);
    if (tokens.length === 0) {
        return NaN;
    }

    let postfix =
        toPostfix(tokens);
    return calculatePostfix(postfix);
}

function tokenize(input) {

    let tokens = [];

    let number = "";

    for (let i = 0; i < input.length; i++) {

        let character =
            input[i];
        if (
            (character >= "0" &&
             character <= "9") ||
            character === "."
        ) {
            number += character;
            continue;
        }
        if (number !== "") {

            tokens.push(
                Number(number)
            );
            number = "";
        }
        if (
            character === "+" ||
            character === "-" ||
            character === "*" ||
            character === "/" ||
            character === "^"
        ) {
            tokens.push(character);
            continue;
        }
        if (
            character === "(" ||
            character === ")"
        ) {
            tokens.push(character);
            continue;
        }
    }
    if (number !== "") {
        tokens.push(
            Number(number)
        );
    }
    return tokens;
}

function precedence(operator) {

    if (
        operator === "+" ||
        operator === "-"
    ) {
        return 1;
    }
    if (
        operator === "*" ||
        operator === "/"
    ) {
        return 2;
    }
    if (operator === "^") {
        return 3;
    }
    return 0;
}

function toPostfix(tokens) {
    let output = [];

    let operators = [];
    for (let token of tokens) {
        if (typeof token === "number") {
            output.push(token);
            continue;
        }
        if (token === "(") {
            operators.push(token);
            continue;
        }
        if (token === ")") {

            while (
                operators.length > 0 &&
                operators[operators.length - 1]
                    !== "("
            ) {
                output.push(
                    operators.pop()
                );
            }
            if (
                operators.length === 0
            ) {
                return [];
            }
            operators.pop();
            continue;
        }
        while (
            operators.length > 0 &&
            operators[operators.length - 1]
                !== "(" &&
            precedence(
                operators[operators.length - 1]
            ) >= precedence(token)
        ) {
            output.push(
                operators.pop()
            );
        }
        operators.push(token);
    }
    while (operators.length > 0) {

        let operator =
            operators.pop();
        if (
            operator === "(" ||
            operator === ")"
        ) {
            return [];
        }
        output.push(operator);
    }
    return output;
}

function calculatePostfix(tokens) {
    let stack = [];

    for (let token of tokens) {
        if (typeof token === "number") {
            stack.push(token);
            continue;
        }

        if (stack.length < 2) {
            return NaN;
        }

        let second =
            stack.pop();

        let first =
            stack.pop();

        let result;

        if (token === "+") {

            result =
                first + second;
        }
        else if (token === "-") {
            result =
                first - second;
        }
        else if (token === "*") {
            result =
                first * second;
        }
        else if (token === "/") {
            if (second === 0) {
                return NaN;
            }
            result =
                first / second;
        }

        else if (token === "^") {
            result =
                Math.pow(first, second);
        }
        else {
            return NaN;
        }
        stack.push(result);
    }
    if (stack.length !== 1) {
        return NaN;
    }
    return stack[0];
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        return "Error";
    }
    if (
        Math.abs(number) < 0.000000000001
    ) {
        number = 0;
    }
    return Number(
        number.toPrecision(12)
    ).toString();
}

function showError() {
    currentInput = "";
    display.textContent = "Error";
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    currentInput += memory;
    updateDisplay();
}

function memoryAdd() {
    let number =
        evaluateExpression(currentInput);
    if (!isNaN(number)) {
        memory += number;
    }
}

function memorySubtract() {
    let number =
        evaluateExpression(currentInput);

    if (!isNaN(number)) {
        memory -= number;
    }
}

document.addEventListener(
    "keydown",
    function(event) {

        let key = event.key;

        if (
            key >= "0" &&
            key <= "9"
        ) {
            addNumber(key);
        }
        else if (key === ".") {

            addDecimal();
        }
        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/" ||
            key === "^"
        ) {
            addOperator(key);
        }
        else if (
            key === "(" ||
            key === ")"
        ) {
            addParenthesis(key);
        }
        else if (
            key === "Enter" ||
            key === "="
        ) {
            calculate();
        }
        else if (key === "Backspace") {
            deleteLast();
        }

        else if (key === "Escape") {

            clearCalculator();
        }

    }
);

