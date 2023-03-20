const { ipcMain, dialog } = require("electron");
const Store = require("electron-store");
const fs = require("fs");
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

// 根据题号获取图片文件列表
const getQuestionImagesFileList = (currentExamNumber) => {
  ipcMain.handle("on-getQuestionImagesFileList-event", (e, currentExamNumber) => {
    console.log("on-getQuestionImagesFileList-event:", currentExamNumber);
    // 根据题号拼接图片路径
    // const imagesPath = "C:/answer-images/" + currentExamNumber > 9 ? currentExamNumber : "0" + currentExamNumber + "/";
    const subPath = currentExamNumber > 9 ? currentExamNumber : "0" + currentExamNumber;
    const imagesPath = `C:/answer-images/${subPath}/`;
    console.log("读取图片路径：", imagesPath);
    let files = fs.readdirSync(imagesPath);
    let fullFilePathList = files.map((item) => {
      let bitmap = fs.readFileSync(imagesPath + item);
      const img = new Buffer.from(bitmap).toString("base64");
      let base64 = "data:image/jpeg;base64," + img;
      return base64;
    });
    // console.log(fullFilePathList);
    return fullFilePathList;
  });
};

module.exports = { getquestionBank, getTeamData, saveTeamData, getQuestionImagesFileList };
