
const { ipcRenderer } = require('electron');

const plusEl = document.querySelector('#plus');
const minusEl = document.querySelector('#minus');
const multiplyEl = document.querySelector('#multiply');
const divideEl = document.querySelector('#divide');
const powerEl = document.querySelector('#power');

const aEl = document.querySelector('#a');
const bEl = document.querySelector('#b');
const resultEl = document.querySelector('#result');

const loadEl = document.querySelector('#load');
const saveEl = document.querySelector('#save');

function send(ch, operator) {
    const a = aEl.value;
    const b = bEl.value;
    const result = resultEl.value;

    ipcRenderer.send(ch, {
        a: a,
        b: b,
        operator: operator,
        result: result
    });
}

function valid() {
    return aEl.value && bEl.value;
}

plusEl.addEventListener('click', function(e) {
    if(!valid()) {
        alert('Please input A & B');
        return;
    }
    send("cal", "+");
})

minusEl.addEventListener('click', function(e)  {
    if(!valid()) {
        alert('Please input A & B');
        return;
    }
    send("cal", "-");
})

divideEl.addEventListener('click', function(e)  {
    if(!valid()) {
        alert('Please input A & B');
        return;
    }
    send("cal", "/");
})

multiplyEl.addEventListener('click', function(e)  {
    if(!valid()) {
        alert('Please input A & B');
        return;
    }
    send("cal", "*");
})

powerEl.addEventListener('click', function(e)  {
    if(!valid()) {
        alert('Please input A & B');
        return;
    }
    send("cal", "^");
})

loadEl.addEventListener('click', function(e)  {
    clearValue();
    send("load");
})

saveEl.addEventListener('click',function (e)  {
    if( !(valid() && resultEl.value) ) {
        alert('Please calculate A & B values first');
        return;
    }
    send("save");
})

ipcRenderer.on("result", function (event, args) {
    resultEl.value = args.result;
    clearOperationStyle();
    switch (args.operator) {
        case '+': setOperationStyle(plusEl); break;
        case '-': setOperationStyle(minusEl); break;
        case '*': setOperationStyle(multiplyEl); break;
        case '/': setOperationStyle(divideEl); break;
        case '^': setOperationStyle(powerEl); break;
    }
});

ipcRenderer.on("load", function (event, args) {
    if(!args.a || !args.b || !args.operator) {
        return
    }
    aEl.value = args.a;
    bEl.value = args.b;
    resultEl.value = args.result;
    clearOperationStyle();
    switch (args.operator) {
        case '+': setOperationStyle(plusEl); break;
        case '-': setOperationStyle(minusEl); break;
        case '*': setOperationStyle(multiplyEl); break;
        case '/': setOperationStyle(divideEl); break;
        case '^': setOperationStyle(powerEl); break;
    }
});

function setOperationStyle(el) {
    el.style.borderColor = 'red';
}

function clearOperationStyle() {
    plusEl.style.borderColor = 'black'
    minusEl.style.borderColor = 'black'
    multiplyEl.style.borderColor = 'black'
    divideEl.style.borderColor = 'black'
    powerEl.style.borderColor = 'black'
}

function clearValue() {
    aEl.value = '';
    bEl.value = '';
    resultEl.value = '';
}
