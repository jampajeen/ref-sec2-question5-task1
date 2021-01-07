const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const { ipcMain } = require('electron');

const localstorePath = `./db.json`
let db;
let state = {
  a: null,
  b: null,
  operator: null,
  result: 0
}

function getState() {
  return {
    a: state.a,
    b: state.b,
    operator: state.operator,
    result: state.result
  }
}

function updateState(obj) {
  state = {
    a: obj.a,
    b: obj.b,
    operator: obj.operator,
    result: obj.result
  }
}

function cal(obj) {
  let a = obj.a;
  let b = obj.b;
  let result = obj.result;
  const operator = obj.operator;

  if (isNaN(a) || isNaN(b) || operator == null) {
    return null;
  }

  a = Number(a)
  b = Number(b)
  result = 0;

  if (operator == '+') {
    result = (a) + (b);
  } else if (operator == '-') {
    result = a - b;
  } else if (operator == '*') {
    result = a * b;
  } else if (operator == '/') {
    result = a / b;
  } else {
    result = Math.pow(a, b);
  }

  const data = {
    a: a,
    b: b,
    operator: operator,
    result: result
  };
  updateState(data);
  return data;
}

function writeLocalDataFile() {
  fs.writeFileSync(localstorePath, JSON.stringify(getState(), { flag: 'w' }));
}

function loadLocalDataFile() {
  return JSON.parse(fs.readFileSync(localstorePath));
}

ipcMain.on("cal", function (event, args) {
  const result = cal(args);
  event.sender.send("result", result);
});

ipcMain.on("load", function (event, args) {
  const result = load();
  event.sender.send("load", result);
});

ipcMain.on("save", function (event, args) {
  save();
});

function load() {
  return loadLocalDataFile();
}

function save() {
  writeLocalDataFile();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 320,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
