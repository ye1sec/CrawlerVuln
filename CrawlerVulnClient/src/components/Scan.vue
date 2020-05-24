<template>
  <el-row>
    <el-col :span="24">
          <el-button type="success" icon="el-icon-aim" :disabled="this.multipleSelection.length===0">扫描</el-button>
          <el-button type="primary" icon="el-icon-folder-add"  @click="dialogFormVisible = true">添加</el-button>

      <el-dialog title="添加目标" :visible.sync="dialogFormVisible" width="450px">
        <el-form :model="form" label-position="right"  :rules="rules" ref="form" label-width="80px">
          <el-form-item label="网站"  prop="sites" >
            <el-input v-model="form.sites"  > </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="desc">
            <el-input v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item label="检测" prop="vulns">
              <el-select v-model="form.vulns" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>

          <el-form-item label="cookie"   prop="cookie">
            <el-radio-group v-model="form.cookie">
              <el-radio label="1" >no</el-radio>
              <el-radio label="2" >yes</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="proxy"  prop="proxy">
            <el-radio-group v-model="form.proxy">
              <el-radio label="1" >no</el-radio>
              <el-radio label="2" >yes</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            <el-button type="danger" @click="resetForm('form')">重置</el-button>

          </el-form-item>


        </el-form>



      </el-dialog>

          <el-button type="danger" icon="el-icon-delete" @click="delTargets" :disabled="this.multipleSelection.length===0">删除</el-button>
          <el-button type="info" icon="el-icon-printer" :disabled="this.multipleSelection.length===0">打印</el-button>

      <!-- table -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="sites"
          label="网站"
          width="300">
          <template slot-scope="scope">{{ scope.row.sites }}</template>
        </el-table-column>

        <el-table-column
          label="备注"
          width="200">
          <template slot-scope="scope">
            <el-tag>{{scope.row.desc}}</el-tag>
          </template>

        </el-table-column>


        <el-table-column
          label="时间"
          width="300"
          :sortable="true"
          :sort-method="sortByTime"
         >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span >{{ scope.row.time }}</span>
          </template>

        </el-table-column>

        <el-table-column
          prop="siteshash"
          label="哈希"
          width="200">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200"  show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="viewSitesVuln(scope.row.siteshash)" type="primary" size="small">查看</el-button>
            <el-button @click="delTarget(scope.row.siteshash)"  size="small" type="danger" >删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      </el-col>
    </el-row>

</template>

<script>
    export default {
        name: "Scan",
       data() {
        return {
          tableData:[],//表格数据
          multipleSelection: [],//选中的数据
          dialogFormVisible: false,//dialog
          //检测下拉框
          options: [{
            value: '1',
            label: '基本检测'
          }, {
            value: '2',
            label: 'SQL注入'
          }, {
            value: '3',
            label: 'XSS'
          }, {
            value: '4',
            label: '爬虫'
          }],

          form: {
            sites: '',
            desc: '',
            vulns: '1',
            cookie: "1",
            proxy: "1"
          },
          rules: {
            sites:[
              {required: true, message: '请输入url地址', trigger: 'blur'},
              {pattern:  /^(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+$)/g , message: '请输入正确的url地址', trigger: 'blur'},
            ],
            desc:[
              {required: true, message: '请输入相关信息', trigger: 'blur'},
              {min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
            ],
            vulns:[],
            cookie:[],
            proxy:[]

          }
        };

       },

      methods: {
        sortByTime(obj1, obj2) {
          let val1 = obj1.time;
          let val2 = obj2.time;
          return val1-val2
        },

        //获取数据
          async getTargets(){
            const res=await this.$http.get('targets');
            this.tableData=res.data;
          },
        //删除一条数据
        delTarget(siteshash){

           this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
           }).then(() => {
               this.$http.get(`targets/${siteshash}/del`).then(res => {
                 this.$message({
                   message: '成功删除一条数据',
                   type: 'success'
                 });
                 this.getTargets();
               });
           }).catch(() => {
             this.$message({
               type: 'info',
               message: '已取消删除'
             });
           });

         },
        //删除多条数据
        delTargets(){
            var siteshashs=this.multipleSelection.map(item => item.siteshash).join();
            console.log(siteshashs);
            this.$confirm('此操作将永远删除选中的数据，是否继续？','提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
                  this.$http.post('targets/del',{siteshashs:siteshashs}).then(res => {
                  this.$message({
                    message: '成功删除多条数据',
                    type: 'success'
                  });
                  this.getTargets();
                });

              }).catch(()=>{
              this.$message({
                type: 'info',
                message: '已取消删除'
              });

            });


        },
        //提交表单
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.dialogFormVisible = false;//取消dialog
              let para = Object.assign({}, this.form);
              this.$http.post('targets/add',para).then(res=>{
                this.getTargets();
                this.$message({
                  message: "添加成功",
                  type: 'success'
                });
              });

            } else {
              return false;
            }
          });
        },
        //重置表单
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },

        toggleSelection(rows) {//表格数据选择
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {

            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },viewSitesVuln(siteshash){
          this.$router.push(`/sites/${siteshash}`);
        }
      },
      created() {
          this.getTargets();
      }
    }
</script>


<style >
 .el-input {
    width: 300px;
  }

</style>
