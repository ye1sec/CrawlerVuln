<template>
   <el-row>

     <el-row>


       <el-col :span="14">
         <!--
           ref="myechart"定义该div也就是画布的名字，在this.$echarts.init(this.$refs.myechart) 图表初始化的时候使用
           this.$refs.myechart 也可以替换为 document.getElementById('main') 或者 document.getElementByClassName('echart-box')
           -->

         <div class="pie echart-box" ref="pie" ></div>

       </el-col>

       <el-col :span="10">

         <el-row>
           <el-col :span="12">
             <div class="columnar echart-box" ref="columnar" ></div>
           </el-col>

       </el-row>
         <el-row>
           &nbsp;
         </el-row>
         <el-row>
           &nbsp;
         </el-row>
         <el-row>
           &nbsp;
         </el-row>
         <el-row>
           &nbsp;
         </el-row>
         <el-row>
           &nbsp;
         </el-row>
         <el-row>
           &nbsp;
         </el-row>

         <el-row>
           <el-col :span="12">
             <el-card shadow="always">
               检测站点数量：{{this.targetsum}}
             </el-card>
           </el-col>
           <el-col :span="12">
             <el-card shadow="always">
               检测漏洞数量：{{this.vulnsum}}
             </el-card>
           </el-col>

         </el-row>

       </el-col>


     </el-row>



   </el-row>
</template>

<script>
    export default {
        name: "Info",
        data(){
          return {
            targetsum:'',
            vulnsum:'',
            option :{
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
              },
              legend: {
                orient: 'vertical',
                left: 10,
                data: ['直达', '邮件营销']
              },
              series: [
                {
                  name: '漏洞类型',
                  type: 'pie',
                  selectedMode: 'single',
                  radius: [0, '20%'],

                  label: {
                    position: 'inner'
                  },
                  labelLine: {
                    show: false
                  },
                  data: []
                },
                {
                  name: '漏洞类型',
                  type: 'pie',
                  radius: ['25%', '40%'],
                  label: {
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 3,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      // abg: {
                      //     backgroundColor: '#333',
                      //     width: '100%',
                      //     align: 'right',
                      //     height: 22,
                      //     borderRadius: [4, 4, 0, 0]
                      // },
                      hr: {
                        borderColor: '#aaa',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 16,
                        lineHeight: 33
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                      }
                    }
                  },
                  data: []
                }
              ]
            },option1 : {
              title: {
                text: '漏洞排名',
                subtext: '数据来自检测站点'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['漏洞数量']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                data: []
              },
              series: [
                {
                  name: '漏洞数量',
                  type: 'bar',
                  data: []//4, 70
                }
              ]
            }

        }
        },methods:{
        async  pieColumnar(){
          //  console.log(this.$echarts);

          var res=await this.$http.get(`vuln/count`);
          var tmpid=[];
          var tmpseries=[];
          var tmpvalue=[];
          if(res.data.length!==0){
            for(let item of res.data){
              tmpid.push(item['_id']);
              tmpvalue.push(item['value'])
              tmpseries.push({value:item['value'],name:item['_id']});

            }
          }
          this.option.legend.data=tmpid;
          this.option.series[0].data=tmpseries;
          this.option.series[1].data=tmpseries;
          //console.log(this.option.series[0].data);
          var piechart = this.$echarts.init(this.$refs.pie); //初始化一个echarts
          piechart.setOption(this.option)  //setOption 用this.option中的数据开始作图

         this.option1.yAxis.data=tmpid.reverse();
         this.option1.series[0].data=tmpvalue.reverse();
          var columnarechart=this.$echarts.init(this.$refs.columnar);
          columnarechart.setOption(this.option1);

        },async getCount(){
           let targetSum=await this.$http.get('/targets/sum');
           let vulnSum=await this.$http.get('/vuln/sum');
           this.targetsum=targetSum.data.count;
           this.vulnsum=vulnSum.data.count;
        }


      },mounted() {
          this.pieColumnar();
      },created() {
          this.getCount();
      }
    }
</script>

<style scoped>
  .pie{   //注意画布必须定义大小
    width: 200px;
    height: 630px;

  }
  .columnar{
    width: 600px;
    height: 300px;


  }


</style>
