<template>


<el-container style="height: 100vh;">

  <el-header style="text-align: right; font-size: 12px">


  </el-header>

  <el-container>

    <el-aside width="12em" style="background-image: linear-gradient(to bottom, #409EFF 0%, #909399 100%)">
      <el-radio-group v-model="isCollapse"  style="margin-bottom: 10px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true" >收起</el-radio-button>
      </el-radio-group>
      <svg class="icon-menu" aria-hidden="true">
        <use xlink:href="#el-icon-ye1szhizhuxia"></use>
      </svg>
      <el-menu router default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" background-color= "#545c64"  text-color="#fff"  active-text-color="#11EE11">

        <el-menu-item index="/info">

          <svg class="icon" aria-hidden="true" >
            <use xlink:href="#el-icon-ye1sloudongdengji"></use>
          </svg>
            <span slot="title">漏洞信息</span>
        </el-menu-item>

        <el-menu-item index="/scan">

          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1sloudongsaomiao"></use>
          </svg>
          <span slot="title">漏洞扫描</span>
        </el-menu-item>
        <el-menu-item index="/detection">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1sliuhangloudongjiance"></use>
          </svg>
          <span slot="title">漏洞检测</span>
        </el-menu-item>
        <el-menu-item index="/detail" >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1sxiangqing"></use>
          </svg>
          <span slot="title">漏洞详情</span>
        </el-menu-item>
        <el-menu-item index="/report">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1sshengchengbaogao"></use>
          </svg>
          <span slot="title" >漏洞报告</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1syonghu"></use>
          </svg>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-ye1sshezhi"></use>
          </svg>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>


    <el-main>
     <router-view></router-view>
    </el-main>
  </el-container>






</el-container>
</template>

<style>
  .el-header {
    background-image: linear-gradient(to right, #409EFF 0%, #F56C6C 100%);
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 12em;
    min-height: 400px;
  }

  .icon {
    display: inline-block;
    vertical-align: middle;
    width: 2em;
    height: 2em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 1em;
  }
  .icon-menu{
    display: inline-block;
    vertical-align: middle;
    width: 2em;
    height: 2em;
    fill: currentColor;
    overflow: hidden;
    margin-bottom: 10px

  }


</style>

<script>
  export default {
    name:"Main",
    data() {
      return {
        isCollapse: true //左菜单的跳转
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },created() {
      this.$http.post('user/verify').then(res=>{

      }).catch(err=>{
        this.$router.push(`/login`);
      })
    }
  };
</script>
