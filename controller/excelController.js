const { ipcMain, dialog } = require("electron");
const fs = require("fs");
const xlsx = require("node-xlsx");
const Store = require("electron-store");
const store = new Store();

const importExcel = () => {
  ipcMain.handle("on-importExcel-event", (e) => {
    // 显示打开文件对话框
    return dialog
      .showOpenDialog({
        properties: ["openFile"],
      })
      .then((result) => {
        // 获取用户选择的文件路径
        const filePath = result.filePaths[0];
        const sheets = xlsx.parse(filePath);
        console.log(sheets[0]);
        const questionBank = parseExcelQuestionData(sheets[0].data);
        const teamData = parseExcelTeamData(sheets[1].data);
        // 将数据设置到缓存中
        store.set("questionBank", questionBank);
        store.set("teamData", teamData);
        const r = { questionNumber: questionBank.length, teamNumber: teamData.length };
        console.log(r);
        return r;
      })
      .catch((err) => {
        console.log("导入失败：", err);
      });
  });
};

// 解析excel 题库数据
function parseExcelQuestionData(sheetData) {
  const questionBank = [];
  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    // console.log(row);
    if (row[0] != null && row[0] != "") {
      let questionItem = {
        number: row[0].toString().trim(),
        score: row[1].toString().trim(),
        question: row[2].toString().trim(),
        option: row[3].toString().trim(),
        answer: row[4].toString().trim(),
      };
      questionBank.push(questionItem);
    }
  }
  return questionBank;
}

// 解析excel 队伍数据
function parseExcelTeamData(sheetData) {
  const teamData = [];
  for (let i = 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    // console.log(row);
    if (row[0] != null) {
      let teamItem = {
        teamNumber: row[0].toString().trim(),
        teamName: row[1].toString().trim(),
        score: 0,
      };
      teamData.push(teamItem);
    }
  }
  return teamData;
}

module.exports = importExcel;
