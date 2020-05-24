<template>
  <div class="main-container">
  <el-tabs  type="card"  v-model="currentView" @tab-click="handleClick">
    <el-tab-pane label="SQL注入" name="first" :key="first">

    </el-tab-pane>

    <el-tab-pane label="XSS" name="second"  :key="second">

    </el-tab-pane>

    <el-tab-pane label="敏感信息" name="third"  :key="third">

    </el-tab-pane>

  </el-tabs>
  <div :is="currentView" keep-alive></div>
  </div>
</template>

<script>
  import SensInfo from './vuln/SensPath.vue';
  import SQL from './vuln/SQL.vue';
  import XSS from './vuln/XSS.vue';
  import SensPath from "./vuln/SensPath";
    export default {
        name: "Detection",
        components:{
          first:SQL,
          second:XSS,
          third:SensPath
        },
        data() {
          return {
            currentView: 'third',
            first:'SQL',
            second:'XSS',
            third:'SensPath'
          };
        },
        methods: {
          handleClick(tab, event) {
            console.log(tab, event);
          }
        },

    }
</script>

<style scoped>

</style>
