<template>

  <el-row >
    <el-form ref="senspathform" :model="senspathform" label-width="80px">
      <el-row>
        <el-col :span="6">

      <el-form-item label="网址">
        <el-input v-model="senspathform.link" ></el-input>
      </el-form-item>
        </el-col>

        <el-col :span="3">
          <el-form-item>
            <el-button  icon="el-icon-s-promotion" @click="fuzzSensPaths">扫描</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="15">
      <el-form-item label="类型">
        <el-radio-group v-model="senspathform.type">
          <el-radio :label="1" >jsp</el-radio>
          <el-radio :label="2" >php</el-radio>
          <el-radio :label="3" >asp</el-radio>
          <el-radio :label="4" >aspx</el-radio>
          <el-radio :label="5" >sen</el-radio>
          <el-radio :label="6" >dir</el-radio>
        </el-radio-group>
      </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-row>
      <div>&nbsp;</div>
    </el-row>

    <el-row>
      <el-col :span="24" :offset="1">
      <el-table
      :data="tableData"
      style="width: 100%"
      height= 500
      :row-class-name="tableRowClassName"
     >
      <el-table-column
        prop="statuscode"
        label="状态"
        width="200"
        style="font-size: 20px"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.statuscode==200" style="color:#00ff00">{{ scope.row.statuscode }}</span>
          <span v-else-if="scope.row.statuscode==302||scope.row.statuscode==301" style="color:#409EFF">{{ scope.row.statuscode}}</span>
          <span v-else style="color:#F56C6C">{{ scope.row.statuscode }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="size"
        label="大小"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.statuscode==200" style="color:#00ff00">{{ scope.row.size}}</span>
          <span v-else-if="scope.row.statuscode==302||scope.row.statuscode==301" style="color:#409EFF">{{ scope.row.size}}</span>
          <span v-else style="color:#F56C6C">{{ scope.row.size }}</span>
        </template>

      </el-table-column>


        <el-table-column
          prop="url"
          label="网址"
          width="300">

          <template slot-scope="scope">
            <span v-if="scope.row.statuscode==200" style="color:#00ff00">{{ scope.row.url }}</span>
            <span v-else-if="scope.row.statuscode==302||scope.row.statuscode==301" style="color:#409EFF">{{ scope.row.url}}</span>
            <span v-else style="color:#F56C6C">{{ scope.row.url }}</span>
          </template>

        </el-table-column>

      <el-table-column
        prop="pathname"
        label="目录"
        width="500">

        <template slot-scope="scope">
          <span v-if="scope.row.statuscode==200" style="color:#00ff00">{{ scope.row.pathname }}</span>
          <span v-else-if="scope.row.statuscode==302||scope.row.statuscode==301" style="color:#409EFF">{{ scope.row.pathname}}</span>
          <span v-else style="color:#F56C6C">{{ scope.row.pathname }}</span>
        </template>

      </el-table-column>
    </el-table>
      </el-col>
    </el-row>

  </el-row>

</template>

<script>

    export default {
      name: "SensPath",
      data() {
        return {
          senspathform: {
            link: '',
            type: 5
          },
          tableData: []
        }
      },
      methods: {

        async getSensPaths(){
            const res=await this.$http.get('senspaths');
            this.tableData=res.data;

        },
        fuzzSensPaths(){
          let para= Object.assign({}, this.senspathform);
          this.$http.post('senspaths/scan',para).then(res=>{
            this.getSensPaths();
          });

        },

        tableRowClassName({row, rowIndex}) {
          if (rowIndex === 1) {
            return 'warning-row';
          } else if (rowIndex === 3) {
            return 'success-row';
          }
          return '';
        }
      },
    created() {
      this.getSensPaths();
    }
    }

</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
