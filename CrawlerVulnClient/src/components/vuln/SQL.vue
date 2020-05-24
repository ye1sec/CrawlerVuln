<template>
  <el-row  :gutter="100">
    <el-col :span="8">
      <el-form ref="form" :model="form" label-width="40px">
        <el-row>
          <el-form-item label="网址">
            <el-input placeholder="请输入网址" v-model="form.url" >
              <el-button slot="append" icon="el-icon-aim" @click="fuzzSQL"></el-button>
            </el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="请求">
            <el-select v-model="form.method" placeholder="GET">
              <el-option label="GET" value="1"></el-option>
              <el-option label="POST" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="data" v-if="this.form.method==2">
            <el-input placeholder="请输入内容" v-model="form.data" ></el-input>
          </el-form-item>
        </el-row>

      </el-form>

    </el-col>


    <el-col :span="16" >
      <el-row>
        <p>SQL Injection</p>
      </el-row>

      <el-row>
        <div>
          <el-tag type="danger" effect="dark">{{sqlmodel.level.length===0 ? "high":sqlmodel.level[0]}}</el-tag>
          <el-tag type="info" effect="dark">{{sqlmodel.level.length===0 ? "open":sqlmodel.level[1]}}</el-tag>
        </div>
      </el-row>
      <el-row>
        &nbsp;
      </el-row>

      <el-row>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="header-icon el-icon-view"></i>  <b>漏洞描述</b>
            </template>
            <div>{{sqlmodel.description}}</div>
            <div>&nbsp;</div>
            <div>漏洞产生点：{{this.sqlinfo.url}}</div>
          </el-collapse-item>
          <el-collapse-item >
            <template slot="title">
              <i class="header-icon el-icon-star-off"></i>  <b>SQL payload</b>
            </template>
            <div>{{this.sqlinfo.payload}}</div>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title">
              <i class="header-icon el-icon-top-right"></i> <b>HTTP请求</b>
            </template>
            <div>{{this.sqlinfo.request}}</div>

          </el-collapse-item>
          <el-collapse-item >
            <template slot="title">
              <i class="header-icon el-icon-bottom-left"></i> <b>HTTP响应</b>
            </template>
            <div v-for="k,v in this.sqlinfo.resheaders">{{v+": "+k}}</div>
            <div>&nbsp;</div>
            <div v-for=" content in this.sqlinfo.response">{{content}}</div>

          </el-collapse-item>

          <el-collapse-item >
            <template slot="title">
              <i class="header-icon el-icon-warning-outline"></i><b>漏洞危害</b>
            </template>
            <div v-for="content in sqlmodel.impact">{{content}}
              <div>&nbsp;</div>
            </div>



          </el-collapse-item>
          <el-collapse-item >
            <template slot="title">
              <i class="header-icon el-icon-link"></i> <b>修复建议</b>
            </template>

            <div v-for="content in sqlmodel.solution">{{content}}
            <div>&nbsp;</div>
            </div>


          </el-collapse-item>


        </el-collapse>
      </el-row>

    </el-col>



  </el-row>
</template>

<script>
  export default {
    name: "SQL",
    data() {
      return {
        form:{
          url: '',
          method: '1',
          data:''
        },
        sqlinfo:{
          url:'',
          payload:'',
          request:'',
          resheaders:{},
          response:[]
        },
        sqlmodel:{
          vulnname:'',
          level:[],
          description:'',
          impact:[],
          solution:[],

        },
        activeNames: ['1']
      }
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      async getSQL(){
        var res=await this.$http.get('sql');
        let sqldata={};
        if(res.data.length!==0){
          sqldata=res.data[0];

          //对response的字符串转换成数组
          if(sqldata.response.includes("\r\n")){
            sqldata.response=sqldata.response.split('\r\n');
          }else if (sqldata.response.includes("\n")) {
            sqldata.response=sqldata.response.split('\n')
          }else{
            sqldata.response=sqldata.response.split("sdfsdfdssdsfds");//任意填写，主要是为了将字符串转换成数组
          }

          sqldata.resheaders=JSON.parse(sqldata.resheaders);

        }
        this.sqlinfo=sqldata;
        //await this.getSQLMoel();

      },
      async getSQLMoel(){
        var  res=await this.$http.get('model/SQL Injection');
        var model={};
        if(res.data.length!==0) {
           model = res.data[0];
          console.log(model);
          model.level = model.level.split('&&&');
          model.impact = model.impact.split('&&&');
          model.solution = model.solution.split('&&&');
          this.sqlmodel = model;
        }
      },
      fuzzSQL(){
        this.$http.post('sql/scan',this.form).then(res=>{
          this.getSQL();
          this.$message({
            message: "SQL检测完成",
            type: 'success'
          });
        })
      }


    }, created() {
      this.getSQLMoel();
      this.getSQL();
    }

  }
</script>

<style scoped>
  .el-select  {
    width: 100px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }


</style>
