const { contextBridge, ipcRenderer } = require("electron");

// 导入excel
const importExcelApi = async () => {
  let result = await ipcRenderer.invoke("on-importExcel-event");
  return result;
};

// 获取题库
const getquestionBankApi = async () => {
  let result = await ipcRenderer.invoke("on-getquestionBank-event");
  return result;
};

// 获取队伍信息
const getTeamDataApi = async () => {
  let result = await ipcRenderer.invoke("on-getTeamData-event");
  return result;
};

// 保存队伍数据
const saveTeamDataApi = async (teamData) => {
  let result = await ipcRenderer.invoke("on-saveTeamData-event", teamData);
  return result;
};

contextBridge.exposeInMainWorld("myApi", {
  importExcelApi,
  getquestionBankApi,
  getTeamDataApi,
  saveTeamDataApi,
});
