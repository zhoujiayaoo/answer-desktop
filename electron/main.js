const { app, BrowserWindow, protocol } = require("electron");
const WinState = require("electron-win-state").default;
const path = require("path");
const importExcel = require(path.join(__dirname, "../controller/excelController"));
const { getquestionBank, getTeamData, saveTeamData, getQuestionImagesFileList } = require("../controller/examController");

const NODE_ENV = process.env.NODE_ENV;
console.log("NODE_ENV: ", NODE_ENV);

const createWindow = () => {
  const winState = new WinState({
    defaultWidth: 1800,
    defaultHeiht: 800,
  });

  const win = new BrowserWindow({
    // 自定义窗口状态
    ...winState.winOptions,
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
    },
    show: false,
  });

  // const prodURL = "http://localhost:5173";
  const prodURL = `file://${path.join(__dirname, "../dist/index.html")}`;

  win.loadURL(NODE_ENV === "development" ? "http://localhost:5173" : prodURL);
  // 打开开发工具
  if (NODE_ENV === "development") {
    win.webContents.openDevTools();
  }
  winState.manage(win);
  // 优雅打开窗口
  win.on("ready-to-show", () => {
    win.show();
  });

  // 注册
  importExcel();
  getquestionBank();
  getTeamData();
  saveTeamData();
  getQuestionImagesFileList();
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
