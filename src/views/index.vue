<script setup>

import router from '@/router';
import { ref } from 'vue';
const importQuestionNumber = ref(0)
const importTeamNumber = ref(0)
const calcScoreType = ref(2)

// 导入excel
const importExcelHandle = () => {
  myApi.importExcelApi().then(data => {
    console.log(data);
    importQuestionNumber.value = data.questionNumber;
    importTeamNumber.value = data.teamNumber
  })
}


const jumpLink = (url) => {
  router.push(url + '/' + calcScoreType.value);
}
</script>

<template>
  <div class="main">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>答题配置</span>
        </div>
      </template>
      <div>
        <el-row>
          <el-button style="width: 100%" @click="importExcelHandle">导入数据</el-button>
          <br>
          <el-card shadow="hover" v-if="importQuestionNumber > 0" style="width: 100%; margin: 10px 0;"> 成功导入题目数量：{{
            importQuestionNumber
          }}, 队伍数量：{{ importTeamNumber }}</el-card>
          <br>
          <el-button type="primary" style="width: 100%" @click="jumpLink('/answer')">进入答题</el-button>
          <el-radio-group v-model="calcScoreType" class="ml-4">
            <el-radio :label="1" size="large">自动计分</el-radio>
            <el-radio :label="2" size="large">手动计分</el-radio>
          </el-radio-group>
        </el-row>
      </div>

    </el-card>

  </div>
</template>


<style scoped lang="stylus">
.main
  width 400px;
  margin: 200px auto ;
</style>
