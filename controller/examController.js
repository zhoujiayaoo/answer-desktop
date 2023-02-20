const { ipcMain, dialog } = require("electron");
const Store = require("electron-store");
const store = new Store();

const getquestionBank = () => {
  ipcMain.handle("on-getquestionBank-event", (e) => {
    return store.get("questionBank");
  });
};

const getTeamData = () => {
  ipcMain.handle("on-getTeamData-event", (e) => {
    console.log("===========teamData");
    return store.get("teamData");
  });
};

const saveTeamData = (teamData) => {
  ipcMain.handle("on-saveTeamData-event", (e, teamData) => {
    console.log("设置新的teamData数据：", teamData);
    return store.set("teamData", teamData);
  });
};

module.exports = { getquestionBank, getTeamData, saveTeamData };
