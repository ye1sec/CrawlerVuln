<template>
  <el-row>
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item label="用户名">
       <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
         <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="">修改</el-button><!-- 密码修改有点问题，就不提供修改了-->
      </el-form-item>


    </el-form>

  </el-row>
    
</template>

<script>
    export default {
        name: "UserEdit",
       data(){
          return {
            form:{
              username:'',
              password:''
            }
          }
       },methods:{
        async  getUserById(){
          let res=await this.$http.get( `user/${this.$route.params.id}/view`);
          this.form.username=res.data.username;
         // this.form.password=res.data.password;

          },
        userUpdate(){
         this.$http.post(`user/${this.$route.params.id}/update`,this.form).then(res=>{
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.$router.push('/user');
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '修改失败'
            });
            this.$router.push('/user');

          })

        }

      },created() {
          this.getUserById();
      }
    }
</script>

<style scoped>


</style>
