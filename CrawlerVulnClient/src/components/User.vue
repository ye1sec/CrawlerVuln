<template>
  <el-row>
  <el-table
    :data="tableData"
   >

    <el-table-column
      prop="username"
      label="用户"
      width="300">
    </el-table-column>

    <el-table-column
      prop="password"
      label="密码"
      width="600">
    </el-table-column>

    <el-table-column
      label="操作"
      width="300">
      <template slot-scope="scope">
        <el-button @click="userEdit(scope.row._id)" type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
</template>

<script>
    export default {
        name: "User",
        data(){
          return {
            tableData:[]
          }
        },methods:{
          async getUser(){
           let res=await this.$http.get('user');
           this.tableData=res.data;
          },
          userEdit(id){
            this.$router.push(`/user/${id}/edit`);
          }

        },
      created() {
          this.getUser();
      }
    }
</script>

<style scoped>

</style>
