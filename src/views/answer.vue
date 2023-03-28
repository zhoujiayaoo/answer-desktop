<script setup>
import { ref, onMounted } from 'vue';
import router from '@/router';

let questionBank = []

// 当前题目序号
let currentExamNumber = 0
let currentAnswerStatus = ref(0)  // 答题状态：0-抢答，1-答题中，2-显示答案（答题完成）
let currentQuestion = ref({})
let currentAnswerTeam = ""
let teamRespond = ref('')
let currentEditTeamInfo = ref({})    // 当前编辑队伍分数
let currentEditTeamScore = ref(0)
let teamData = ref([])
let editTeamScoreDialogVisible = ref(false)
// 图片列表
let questionImagesFileList = ref([])
let countDown = ref(60)
let startCountDownFlag = ref(true)
let timer
const calcScoreType = router.currentRoute.value.params['calcScoreType']
const manualRight = ref(false)
const manualWrong = ref(false)

console.log("计分模式：", calcScoreType)


// 获取题库
const getquestionBank = () => {
  myApi.getquestionBankApi().then((data) => {
    console.log(data);
    questionBank = data
    currentQuestion.value = data[0]
  })
}

// 获取队伍信息
const getTeamData = () => {
  myApi.getTeamDataApi().then((data) => {
    console.log("加载队伍数据：", data);
    teamData.value = data.sort((a, b) => b.score - a.score);
  })
}

// 切换题目
const switchExam = (type) => {
  startCountDown(60)
  if (type == 1 && currentExamNumber < questionBank.length - 1) {
    currentExamNumber += type
    currentQuestion.value = questionBank[currentExamNumber]
  }
  if (type == -1 && currentExamNumber != 0) {
    currentExamNumber += type
    currentQuestion.value = questionBank[currentExamNumber]
  }

  // 初始化页面数据
  currentAnswerStatus.value = 0
  currentAnswerTeam = {}
  teamRespond.value = ''
  questionImagesFileList.value = []
  manualRight.value = false
  manualWrong.value = false
  getQuestionImagesFileList(currentExamNumber + 1)    // 第一道题是1
}

const jumpLink = (url) => {
  router.push(url);
}

// 监听键盘点击
const handleKeyDown = (event) => {
  const k = event.key
  console.log("键盘点击：", k);
  console.log(editTeamScoreDialogVisible);
  // 抢答
  if (currentAnswerStatus.value == 0 && editTeamScoreDialogVisible.value == false) {
    if (event.key > 0 && event.key <= teamData.value.length) {
      currentAnswerStatus.value = 1
      startCountDown(20)
      console.log("当前抢答人：", event.key);
      teamData.value.forEach(item => {
        if (item.teamNumber == k) {
          currentAnswerTeam = item
        }
      })
    }
  }

  // 队伍作答
  if (currentAnswerStatus.value == 1) {
    // 如果按下的是ABCD
    console.log("ABCDabcd".indexOf(k));
    if ("ABCDabcd".indexOf(k) >= 0) {
      teamRespond.value = k.toUpperCase()
    }
  }

};

// 手动计分
const manualCalcScore = (type) => {
  // 回答错误
  if (type == 0 && !manualWrong.value) {
    manualWrong.value = true
    currentAnswerTeam.score -= parseInt(currentQuestion.value.score)
    if (manualRight.value) {
      currentAnswerTeam.score -= parseInt(currentQuestion.value.score)
      manualRight.value = false
    }
  }
  // 回答正确
  if (type == 1 && !manualRight.value) {
    manualRight.value = true
    currentAnswerTeam.score += parseInt(currentQuestion.value.score)
    if (manualWrong.value) {
      currentAnswerTeam.score += parseInt(currentQuestion.value.score)
      manualWrong.value = false
    }
  }
  disposeTeamScore()
}


// 显示答案
const showAnswer = () => {
  abortCountDown()
  // console.log("当前问题分值：", currentQuestion.value.score);
  if (currentAnswerStatus.value == 1) {
    currentAnswerStatus.value = 2
    if (calcScoreType == 1) {
      if (teamRespond.value == currentQuestion.value.answer) {
        currentAnswerTeam.score += parseInt(currentQuestion.value.score)
      } else {
        currentAnswerTeam.score -= parseInt(currentQuestion.value.score)
      }
      disposeTeamScore()
    }
  }
}

// 队伍计分
const disposeTeamScore = () => {
  // 处理队伍分值
  console.log("当前队伍：", currentAnswerTeam);
  for (let item of teamData.value) {
    // console.log("item:", item);
    if (item.teamNumber == currentAnswerTeam.teamNumber) {
      console.log("当前队伍分数：", item.score, "。当前队伍加分：", currentAnswerTeam.score);
      item.score = parseInt(currentAnswerTeam.score)
      break;
    }
  }
  saveNewTeamData()
}


// 行双击事件
const doubleClickHandle = (row) => {
  // console.log(row);
  editTeamScoreDialogVisible.value = true
  currentEditTeamInfo.value = row
  currentEditTeamScore.value = row.score
  // currentEditTeamInfo.value.score = row.score
  // currentEditTeamInfo.value.teamName = row.teamName
}

// 编辑队伍分数确定事件处理
const editTeamSocreConfirmHandle = () => {
  editTeamScoreDialogVisible.value = false
  // console.log(currentEditTeamInfo);
  currentEditTeamInfo.value.score = Number(currentEditTeamScore.value)    // 设置新的值
  // 更新表格信息到缓存
  saveNewTeamData()
}

const saveNewTeamData = () => {
  // 重新设置新值
  let saveTeamData = []
  teamData.value.forEach(item => {
    let t = {
      teamNumber: item.teamNumber,
      teamName: item.teamName,
      score: Number(item.score)
    }
    saveTeamData.push(t)
  })

  // 保存队伍数据
  console.log("显示全部队伍当前数据", saveTeamData);

  myApi.saveTeamDataApi(saveTeamData).then(() => { })
}

// 根据题号获取图片文件列表
const getQuestionImagesFileList = (currentExamNumber) => {
  console.log("当前题号：", currentExamNumber);
  myApi.getQuestionImagesFileListApi(currentExamNumber).then((data) => {
    console.log(data);
    questionImagesFileList.value = data
  })
}

// 开始倒计时
const startCountDown = (s) => {
  clearTimeout(timer)
  startCountDownFlag = true
  countDown.value = s
  // 清除定时器
  timer = window.setInterval(function () {
    countDown.value -= 1
    console.log();
    if (countDown.value == 0) {
      clearTimeout(timer)
    }
  }, 1000);
}

// 结束倒计时
const abortCountDown = () => {
  startCountDownFlag = false
  clearTimeout(timer)
}


onMounted(() => {
  getquestionBank()
  getTeamData()
  getQuestionImagesFileList(currentExamNumber + 1)    // 根据题号获取图片
  window.addEventListener('keydown', handleKeyDown);
  startCountDown(60)
});


</script>

<template>
  <div class="main">
    <el-card class="answer">
      <div class="exam">
        <span>{{ currentExamNumber + 1 + ". " }}</span><span style="color: blue;">【{{ currentQuestion.score }}分】</span>
        {{ currentQuestion.question }}
      </div>
      <el-divider />
      <div class="exam">
        {{ currentQuestion.option }}
      </div>
      <el-image v-for="imageBase64 in questionImagesFileList" style="width: 100px; height: 100px; margin-left: 5px;"
        :src="imageBase64" :zoom-rate="1.2" :preview-src-list="questionImagesFileList" :initial-index="4" fit="cover" />
      <el-divider />
      <h1 v-if="currentAnswerStatus == 2">正确答案：<span style="color: blue">{{ currentQuestion.answer }}</span></h1>
    </el-card>

    <el-card class="right">
      <template #header>
        <div class="card-header">
          <span>队伍排名</span>
        </div>
      </template>
      <el-table :data="teamData" style="width: 100%;font-size: 23px;line-height: 35px; "
        :default-sort="{ prop: 'score', order: 'descending' }" :row-style="{ height: '75px' }" :cell-style="{}"
        @cell-dblclick="doubleClickHandle">
        <el-table-column type="index" label="名次" width="100" />
        <el-table-column prop="teamNumber" label="编号" width="100" />
        <el-table-column prop="teamName" label="名称" width="280" />
        <el-table-column prop="score" label="分数" />
      </el-table>
    </el-card>

    <div class="bottom">
      <el-image v-if="currentAnswerStatus == 0" src="rush.gif" />
      <div v-if="currentAnswerStatus >= 1">
        <h1 style="margin-left: 30px;">请【<span style="color: red">{{ currentAnswerTeam.teamNumber + " - " +
          currentAnswerTeam.teamName }}</span>】队答题 <span v-if="teamRespond != ''">{{ ": " + teamRespond }}</span>

          <span v-if="currentAnswerStatus == 2 && calcScoreType == 1">。 回答{{ teamRespond == currentQuestion.answer ?
            "正确，加" : "错误，扣"
          }}{{ currentQuestion.score }}分</span>
        </h1>


      </div>
    </div>


    <div class="option-button">
      <div v-if="calcScoreType == 2 && currentAnswerStatus >= 1" style="float: right; margin-bottom: 5px;">
        <el-button-group class="ml-4">
          <el-button style="width:120px;height: 50px;" type="danger" size="large"
            @click="manualCalcScore(0)">错误</el-button>
          <el-button style="width:120px;height: 50px;" type="success" size="large"
            @click="manualCalcScore(1)">正确</el-button>
        </el-button-group>
      </div>

      <div>
        <el-button-group class="ml-4">
          <el-button type="primary" size="large" @click="jumpLink('/')">首页</el-button>
          <el-button type="info" size="large" @click="showAnswer">显示答案</el-button>
          <el-button type="primary" size="large" @click="switchExam(-1)">上一题</el-button>
          <el-button type="primary" size="large" @click="switchExam(1)">下一题</el-button>
        </el-button-group>
      </div>

    </div>

    <el-dialog v-model="editTeamScoreDialogVisible" :title="'编辑【' + currentEditTeamInfo.teamName + '】分数'" width="30%"
      center>
      <el-input v-model="currentEditTeamScore" placeholder="Please input" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTeamScoreDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editTeamSocreConfirmHandle">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div v-if="startCountDownFlag" class="count-down">
      <h1 style="color: red;font-size: 160px; line-height: 160px;">{{ countDown }}</h1>
    </div>
  </div>
</template>

<style scoped lang="stylus">
div.main
  height:100vh;
  .answer
    width: 65%;
    height: 80%;
    float: left;
    white-space: pre-line;
    .exam
      line-height: 180%;
      font-size: 2rem;
  .right
    float: right;
    height: 80%;
    width: 34%;
  .bottom
    float left
    width: 95%;  
    height: 20%;
    // border: 1px solid red;
  .option-button
    height: 50px;
    position: absolute;
    right: 100px;
    bottom: 50px;

.el-table .cell
  line-height: 40px;

.count-down
  position: absolute;
  top: -120px;
  right : 10px;
  z-index: 999;
  opacity: 0.4;
</style>
