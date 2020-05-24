<template>
  <el-row  :gutter="100">
    <el-col :span="8">
    <el-form ref="form" :model="form" label-width="40px">
          <el-row>
          <el-form-item label="网址">
            <el-input placeholder="请输入网址" v-model="form.url" >
              <el-button slot="append" icon="el-icon-aim" @click="fuzzXSS"></el-button>
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
        <p>Cross Site Scripting</p>
      </el-row>

      <el-row>
        <div>
        <el-tag type="danger" effect="dark">high</el-tag>
        <el-tag type="info" effect="dark">open</el-tag>
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
          <div>{{xssmodel.description}}</div>
          <div>&nbsp;</div>
          <div>漏洞产生点：{{this.xssinfo.url}}</div>
        </el-collapse-item>
        <el-collapse-item >
          <template slot="title">
            <i class="header-icon el-icon-star-off"></i>  <b>XSS payload</b>
          </template>
          <div>{{this.xssinfo.payload}}</div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-top-right"></i> <b>HTTP请求</b>
          </template>
          <div>{{this.xssinfo.request}}</div>

        </el-collapse-item>
        <el-collapse-item >
          <template slot="title">
            <i class="header-icon el-icon-bottom-left"></i> <b>HTTP响应</b>
          </template>
          <div v-for="k,v in this.xssinfo.resheaders">{{v+": "+k}}</div>
          <div>&nbsp;</div>
          <div v-for=" content in this.xssinfo.response">{{content}}</div>

        </el-collapse-item>

        <el-collapse-item >
          <template slot="title">
            <i class="header-icon el-icon-warning-outline"></i><b>漏洞危害</b>
          </template>

          <div v-for="content in xssmodel.impact">{{content}}
            <div>&nbsp;</div>
          </div>

        </el-collapse-item>
        <el-collapse-item >
          <template slot="title">
            <i class="header-icon el-icon-link"></i> <b>修复建议</b>
          </template>

          <div v-for="content in xssmodel.solution">{{content}}
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
        name: "XSS",
      data() {
        return {
          form:{
            url: '',
            method: '1',
            data:''
          },
          xssinfo:{
            url:'',
            payload:'',
            request:'',
            resheaders:{},
            response:[]
          },
          xssmodel:{
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
        async getXSS(){
          const res=await this.$http.get('xss');
          let xssdata={};
         if(res.data.length!==0){
            xssdata=res.data[0];
           
           
           //对response的字符串转换成数组
           if(xssdata.response.includes("\r\n")){
             xssdata.response=xssdata.response.split('\r\n');
           }else if (xssdata.response.includes("\n")) {
             xssdata.response=xssdata.response.split('\n')
           }else{
             xssdata.response=xssdata.response.split("sdfsdfdssdsfds");//任意填写，主要是为了将字符串转换成数组
           }

           xssdata.resheaders=JSON.parse(xssdata.resheaders);

         }
          this.xssinfo=xssdata;
        },
        async getXSSMoel(){
          var  res=await this.$http.get('model/Cross Site Scripting');
          var model={};
          if(res.data.length!==0) {
            model = res.data[0];
            console.log(model);
            model.level = model.level.split('&&&');
            model.impact = model.impact.split('&&&');
            model.solution = model.solution.split('&&&');
            this.xssmodel = model;
          }
        },
        fuzzXSS(){
          this.$http.post('xss/scan',this.form).then(res=>{
            this.getXSS();
            this.$message({
              message: "XSS检测完成",
              type: 'success'
            });
          })
        }


      }, created() {
        this.getXSS();
        this.getXSSMoel();
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
