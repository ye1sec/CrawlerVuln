<template>

  <el-row>
  <el-row>
    <p>{{this.vulnmodel.vulnname}}</p>
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
        <div>{{this.vulnmodel.description}}</div>
        <div>&nbsp;</div>
        <div>漏洞产生点：{{this.vulninfo.url}}</div>
      </el-collapse-item>
      <el-collapse-item >
        <template slot="title">
          <i class="header-icon el-icon-star-off"></i>  <b>payload</b>
        </template>
        <div>{{this.vulninfo.payload}}</div>
      </el-collapse-item>
      <el-collapse-item>
        <template slot="title">
          <i class="header-icon el-icon-top-right"></i> <b>HTTP请求</b>
        </template>
        <div>{{this.vulninfo.request}}</div>

      </el-collapse-item>
      <el-collapse-item >
        <template slot="title">
          <i class="header-icon el-icon-bottom-left"></i> <b>HTTP响应</b>
        </template>
        <div v-for="k,v in this.vulninfo.resheaders">{{v+": "+k}}</div>
        <div>&nbsp;</div>
        <div v-for=" content in this.vulninfo.response">{{content}}</div>

      </el-collapse-item>

      <el-collapse-item >
        <template slot="title">
          <i class="header-icon el-icon-warning-outline"></i><b>漏洞危害</b>
        </template>

        <div v-for="content in this.vulnmodel.impact">{{content}}
          <div>&nbsp;</div>
        </div>

      </el-collapse-item>
      <el-collapse-item >
        <template slot="title">
          <i class="header-icon el-icon-link"></i> <b>修复建议</b>
        </template>

        <div v-for="content in this.vulnmodel.solution">{{content}}
          <div>&nbsp;</div>
        </div>

      </el-collapse-item>


    </el-collapse>
  </el-row>
</el-row>
</template>

<script>
    export default {
        name: "Vuln",
        data(){
          return {
            vulnmodel:{
              vulnname:'',
              level:[],
              description:'',
              impact:[],
              solution:[]

            },
            vulninfo:{
              url:'',
              payload:'',
              request:'',
              resheaders:{},
              response:[]

            },
            activeNames: ['1']
          }
        },
       methods:{
         handleChange(val) {
           console.log(val);
         },
         async getVuln(id){
           const res=await this.$http.get(`vuln/${id}/view`);
           var vulndata={};
           if(res.data.length!==0){
             //console.log(res.data);
             vulndata=res.data;
             //console.log(vulndata);
             //对response的字符串转换成数组
             if(vulndata.response.includes("\r\n")){
               vulndata.response=vulndata.response.split('\r\n');
             }else if (vulndata.response.includes("\n")) {
               vulndata.response=vulndata.response.split('\n')
             }else{
               vulndata.response=vulndata.response.split("sdfsdfdssdsfds");//任意填写，主要是为了将字符串转换成数组
             }

             vulndata.resheaders=JSON.parse(vulndata.resheaders);



           }
           this.vulninfo=vulndata;
           await this.getVulnMoel(this.vulninfo.vulnname);

         },
         //得到某类漏洞的模板
         async getVulnMoel(vulnname){
           var  res=await this.$http.get(`model/${vulnname}`);
           var model={};
           if(res.data.length!==0) {
             model = res.data[0];
             console.log(model);
             model.level = model.level.split('&&&');
             model.impact = model.impact.split('&&&');
             model.solution = model.solution.split('&&&');
             this.vulnmodel = model;
           }
         }
       },created() {
          console.log(this.$route.params.id);
          this.getVuln(this.$route.params.id);

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
