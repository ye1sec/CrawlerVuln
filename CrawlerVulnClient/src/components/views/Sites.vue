<template>
  <el-row>

   <el-row>


     <el-col :span="12">
       <!--
         ref="myechart"定义该div也就是画布的名字，在this.$echarts.init(this.$refs.myechart) 图表初始化的时候使用
         this.$refs.myechart 也可以替换为 document.getElementById('main') 或者 document.getElementByClassName('echart-box')
         -->

       <div class="HelloWorld echart-box" ref="myechart" ></div>

     </el-col>

     <el-col :span="12">

       <el-input
         placeholder="输入关键字进行过滤"
         v-model="filterText">
       </el-input>
       <p>网站目录</p>


       <el-tree
         class="filter-tree"
         :data="filesData"
         :props="defaultProps"
         :filter-node-method="filterNode"
         ref="tree">
       </el-tree>
     </el-col>




   </el-row>






  <el-row>
    <el-table
      :data="tableData.filter(data=> !search || data.vulnname.toLowerCase().includes(search.toLowerCase()) || data.time.toLowerCase().includes(search.toLowerCase())||data.url.toLowerCase().includes(search.toLowerCase()))"
      height= 700
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
            size="mini"
            placeholder="search"/>
        </template>

        <template slot-scope="scope">
          <el-tag @click="viewVlun(scope.row._id)" type="primary" size="small">查看</el-tag>
          <el-tag @click="delVulnById(scope.row._id)"  size="small" type="danger" >删除</el-tag>
        </template>

      </el-table-column>
    </el-table>
  </el-row>

  </el-row>
</template>

<script>
    export default {
        name: "Sites",
        watch: {
        filterText(val) {
          this.$refs.tree.filter(val);
        }
      },
      data(){
        return {
          tableData:[],
          search: '',
          //饼图数据
          option :{
            title: {
              text: '网站漏洞',
              subtext: '',
              left: 300
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: []//'直接访问', '邮件营销', '联盟广告'
            },
            series: [
              {
                name: '漏洞类型',
                type: 'pie',
                radius: '40%',
                center: ['50%', '60%'],
                data: [
                //  {value: 335, name: '直接访问'},
                //  {value: 310, name: '邮件营销'},
               //  {value: 234, name: '联盟广告'}

                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.6)'
                  }
                }
              }
            ]
          },
          //url树状图
          filterText: '',
          filesData: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        }
      },
      methods:{
          //树目录
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        async getVulns(){
          let res= await this.$http.get(`vuln/${this.$route.params.siteshash}/sites`);
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

        },
        async  pieChart(){
        //  console.log(this.$echarts);

        var res=await this.$http.get(`vuln/${this.$route.params.siteshash}/count`);
        var tmplegend=[];
        var tmpseries=[];
        if(res.data.length!==0){
          for(let item of res.data){
            tmplegend.push(item['_id']);
            tmpseries.push({value:item['value'],name:item['_id']});

          }
        }
        this.option.legend.data=tmplegend;
        this.option.series[0].data=tmpseries;
        //console.log(this.option.series[0].data);
        var myechart = this.$echarts.init(this.$refs.myechart); //初始化一个echarts
        myechart.setOption(this.option)  //setOption 用this.option中的数据开始作图
        },
        async getUrlsTree(){
         var res= await this.$http.get(`crawler/${this.$route.params.siteshash}/file`);
         console.log(res.data);
         this.filesData=res.data;


        }
     },created() {
        this.getVulns();
        this.getUrlsTree();


      },mounted() {
       // this.getVulnCount();
        this.pieChart();

      }

    }
</script>

<style scoped>
  .HelloWorld{   //注意画布必须定义大小
    width: 200px;
    height: 650px;

  }

</style>
