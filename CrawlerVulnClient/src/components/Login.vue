<template>
  <body id="poster">
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">基于爬虫的Web漏洞检测</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>

    <el-form-item>
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>

    <el-form-item >
      <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
    </el-form-item>
  </el-form>
  </body>

</template>

<script>
    export default {
        name: "Login",
      data() {
        return {
          loginForm: {
            username: '',
            password: ''
          },
          responseResult: []
        }
      },
      methods: {
        login() {
          this.$http.post('user/login',this.loginForm).then(res=>{

            console.log(res.data);
            window.localStorage.setItem('token',res.data.token);
            this.$router.push('/');
            this.$message({
              type:"success",
              message:"登录成功"
            })
            }

          ).catch(err=>{
            this.$message({
              type:"danger",
              message:"用户名或密码错误"
            })
            console.log(err.data);
          })
        }
      }
    }
</script>

<style scoped>
  #poster {
    background:url("../assets/eva.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  body{
    margin: 0px;
    padding: 0;
  }

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 150px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
