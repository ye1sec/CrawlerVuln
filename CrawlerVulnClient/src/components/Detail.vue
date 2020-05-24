<template>
  <el-table
    :data="tableData.filter(data=> !search || data.vulnname.toLowerCase().includes(search.toLowerCase()) || data.time.toLowerCase().includes(search.toLowerCase())||data.url.toLowerCase().includes(search.toLowerCase()))"
    height= 100%
    border
    style="width: 100%">
    <el-table-column
      label="漏洞名称"
      width="200">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.vulnname === 'SQL Injection' ? 'warning' : 'info'"
          disable-transitions>{{scope.row.vulnname}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="url"
      label="URL"
      width="660">
    </el-table-column>
    <el-table-column
      width="200"
      label="检测时间"
      :sortable="true"
      :sort-method="sortByTime"
     >
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span >{{ scope.row.time }}</span>
      </template>
    </el-table-column>
    <el-table-column
    width="200">

      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="small"
          placeholder="search"/>
      </template>

      <template slot-scope="scope">
        <el-tag @click="viewVlun(scope.row._id)" type="primary" size="small">查看</el-tag>
        <el-tag @click="delVulnById(scope.row._id)"  size="small" type="danger" >删除</el-tag>
      </template>

    </el-table-column>
  </el-table>

</template>


<script>
  export default {
    name: "Detail",
    data(){
      return {
        tableData:[],
        search: ''
      }
    },
    methods:{
     async getVulns(){
       let res= await this.$http.get('vuln');
       this.tableData=res.data;

      },
      //对时间进行排序
      sortByTime(obj1, obj2) {
        let val1 = obj1.time;
        let val2 = obj2.time;
        return val1-val2
      },
      delVulnById(id){
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get(`vuln/${id}/del`).then(res => {
            this.$message({
              message: '成功删除一条数据',
              type: 'success'
            });
            this.getVulns();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      viewVlun(id){
       this.$router.push(`/vuln/${id}`)

      }

    },created() {
      this.getVulns();

    }


  }
</script>

<style scoped>

</style>
