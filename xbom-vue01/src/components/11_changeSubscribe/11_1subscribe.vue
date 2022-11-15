<template>
  <div>

    <!-- 标题 -->
    <div style="color: #124880;margin-top: 10px">
      <h2>|&emsp;实时订阅信息展示</h2>
    </div>

    <!-- 实时订阅信息表单展示 -->
    <div  v-loading="loading">

      <!--    实时订阅信息展示  -->

      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px"
        :header-cell-style="{'text-align':'center'}">

        <el-table-column
          prop="username"
          label="操作用户"
          width="100"
          align="center">
        </el-table-column>

        <el-table-column
          prop="time"
          label="操作时间"
          sortable
          width="160"
          align="center">
        </el-table-column>

        <el-table-column
          prop="status"
          label="操作类型"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button plain :type="confirmStatusType(scope.row.status)" size="small">{{confirmStatus(scope.row.status) }}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="bom"
          label="操作BOM"
          width="100"
          align="center">
        </el-table-column>

        <el-table-column
          prop="changeName"
          label="节点名称"
          width="180"
          align="center">
        </el-table-column>

        <el-table-column
          prop="value"
          label="节点内编码"
          align="center">
        </el-table-column>

        <el-table-column
          label="操作详情"
          align="center"
          width="160">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="lookTitleDate(scope.$index,scope.row,'detailFrom')">查看</el-button>
            <el-button type="primary" size="small" @click="store(scope.$index,scope.row)" >存储</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--实时订阅信息展示分页组件-->

      <!--分割线-->
      <div style="margin-top:50px "><el-divider></el-divider></div>

      <!-- 标题 -->
      <div style="color: #124880;display: flex;width: 100%;margin-top: 20px;margin-bottom: 20px">
        <h2>|&emsp;历史订阅信息展示</h2>
      </div>

      <div style="color: #124880;display: flex;width: 100%;margin-top: 20px;margin-bottom: 20px">
        <h3>|&emsp;历史订阅信息查询</h3>
      </div>

      <!--信息查询界面-->
      <div style="display: flex; margin-bottom: 20px;margin-top: 10px">
        <el-input placeholder="根据操作用户查找" v-model="username" size="small" style="width: 300px;margin-right: 30px">
          <el-button slot="append" icon="el-icon-search"  ></el-button>
        </el-input>
        <el-input placeholder="根据操作BOM查找"  v-model="bom" size="small" style="width: 300px;margin-right: 30px">
          <el-button slot="append" icon="el-icon-search"  ></el-button>
        </el-input>
        <el-input placeholder="根据节点内编码查找"  v-model="value"  size="small" style="width: 300px;margin-right: 30px">
          <el-button slot="append" icon="el-icon-search"  ></el-button>
        </el-input>
        <el-button   type="primary" size="small" style="margin-right: 20px;margin-left:10px" @click="findFileByName()">查 询</el-button>
        <el-button   type="primary" size="small"  @click="findAllFile()">重 置</el-button>
      </div>

      <!-- 订阅信息表单展示 -->
      <div>
        <el-table
          :data="tableData1"
          border
          style="width: 100%;margin-top: 10px"
          :header-cell-style="{'text-align':'center'}">
          <el-table-column
            prop="username"
            label="操作用户"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="time"
            label="操作时间"
            sortable
            width="300"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="操作类型"
            width="120"
            align="center">
            <template slot-scope="scope">
              <el-button plain :type="confirmStatusType(scope.row.status)" size="small">{{confirmStatus(scope.row.status) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="bom"
            label="操作BOM"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            prop="value"
            label="操作节点内编码"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="changeName"
            label="操作节点名称"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作详情"
            align="store"
            width="160">
            <template slot-scope="scope">
              <el-button  type="success" size="small" @click="look(scope.$index, scope.row)">查看</el-button>
              <div style="float: right;margin-right: 10px;">
                <el-popconfirm confirmButtonText='确定删除' cancelButtonText='取消删除'  icon-color="Red" title="确定将该该行数据嘛吗？"
                               @confirm="deleteRow(scope.$index, scope.row)">
                  <el-button slot="reference" type="danger" size="small">删除</el-button>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <div style="float: right;margin-top: 10px">
          <el-pagination @current-change="handleCurrentChange1" :current-page="currentPage" background
                         layout="prev, pager, next" :total="totalrow" :page-size="pageSize">
          </el-pagination>
        </div>
      </div>

      <!-- 详细信息查看页 -->
      <el-dialog :title='formAttribute.name + "节点信息"'  center :visible.sync="dialogFormVisible"  width="72%" >
        <div style="color: #124880;margin-top: 10px;margin-bottom: 10px">
          <h3>|&emsp;节点信息展示 </h3>
        </div>

        <el-form :model="formAttribute" label-width="80px" label-position="right" size="small" style="width: 920px" inline>
          <el-form-item label="层级" class="itemDelete">
            <el-input v-model="formAttribute.location" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="父节点" class="itemDelete">
            <el-input v-model="formAttribute.parent" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="名称" class="itemDelete">
            <el-input v-model="formAttribute.name" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="描述" class="itemDelete">
            <el-input v-model="formAttribute.descript" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="创建者" class="itemDelete">
            <el-input v-model="formAttribute.builder" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="编辑者" class="itemDelete">
            <el-input v-model="formAttribute.editor" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="创建时间" class="itemDelete">
            <el-input v-model="formAttribute.editorTime" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="版本号" class="itemDelete">
            <el-input v-model="formAttribute.version" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="数据详情" class="itemDelete">
            <el-input v-model="formAttribute.detail" autocomplete="off" readonly></el-input>
          </el-form-item>
        </el-form>

        <!--自动新增赋值 -->
        <div class="prop" style="float: left;margin-left: 0px;margin-top: 10px;">
          <el-form  :model="formAttribute" label-width="80px" label-position="right" size="small" style="width: 920px" inline>

            <el-form-item v-bind:label="formAttribute.propOne" class="itemDelete"   v-show="!(formAttribute.propOne === ''||formAttribute.propOne == null) " >
              <el-input v-model="formAttribute.propTwo" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propThree" class="itemDelete"  v-show="!(formAttribute.propThree === ''||formAttribute.propThree == null) " >
              <el-input v-model="formAttribute.propFour" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>


            <el-form-item v-bind:label="formAttribute.propFive" class="itemDelete"  v-show="!(formAttribute.propFive=== ''||formAttribute.propFive == null) " >
              <el-input v-model="formAttribute.propSix" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propSeven" class="itemDelete"  v-show="!(formAttribute.propSeven=== ''||formAttribute.propSeven == null) " >
              <el-input v-model="formAttribute.propEight" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propNine" class="itemDelete"  v-show="!(formAttribute.propNine=== ''||formAttribute.propNine == null) " >
              <el-input v-model="formAttribute.propTen" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propEleven" class="itemDelete"    v-show="!(formAttribute.propEleven === ''||formAttribute.propEleven == null) " >
              <el-input v-model="formAttribute.propTwelve" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propThirteen" class="itemDelete"   v-show="!(formAttribute.propThirteen === ''||formAttribute.propThirteen == null) " >
              <el-input v-model="formAttribute.propFourteen" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>


            <el-form-item v-bind:label="formAttribute.propFifteen" class="itemDelete"   v-show="!(formAttribute.propFifteen === ''||formAttribute.propFifteen == null) " >
              <el-input v-model="formAttribute.propSixteen" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propSeventeen" class="itemDelete"  v-show="!(formAttribute.propSeventeen === ''||formAttribute.propSeventeen == null) " >
              <el-input v-model="formAttribute.propEighteen" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

            <el-form-item v-bind:label="formAttribute.propNineteen" class="itemDelete"  v-show="!(formAttribute.propNineteen === ''||formAttribute.propNineteen == null) " >
              <el-input v-model="formAttribute.propTwenty" autocomplete="off" placeholder="请输入内容"  readonly></el-input>
            </el-form-item>

          </el-form>
        </div>

        <div style="float: top; color: #124880;margin-left:0px;margin-top: 120px;margin-bottom: 10px">
          <h3>|&emsp;关联信息展示 </h3>
        </div>

        <!-- 删除关联信息表格 -->
        <el-table
          :data="tableConnect"
          border
          style="width: 100%;margin-top: 10px"
          :header-cell-style="{'text-align':'center'}">
          <el-table-column
            prop="connectNodeName"
            label="关联节点名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="connectNodeValue"
            label="关联节点内编码值"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="connectRelation"
            label="关联类型"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="connectTime"
            label="关联时间"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="修改状态"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-button plain :type="confirmStatusType(scope.row.status)" size="small">{{ confirmStatus(scope.row.status) }}</el-button>
            </template>
          </el-table-column>status
        </el-table>

        <div style="color: #124880;margin-top: 10px;margin-bottom: 10px">
          <h3>|&emsp;文件信息展示 </h3>
        </div>

        <el-table
          :data="tableFile"
          border
          style="width: 100%;margin-top: 10px"
          :header-cell-style="{'text-align':'center'}">
          <el-table-column
            prop="fileName"
            label="文件名称"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fileType"
            label="文件类型"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="filePath"
            label="文件路径"
            align="center">
          </el-table-column>
          <el-table-column
            prop="uploadTime"
            label="修改时间"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="修改状态"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-button plain :type="confirmStatusType(scope.row.status)" size="small">{{ confirmStatus(scope.row.status) }}</el-button>
            </template>
          </el-table-column>status
        </el-table>

        <div slot="footer" class="dialog-footer">
          <!--<el-button @click="dialogFormVisible = false" type="info">取 消</el-button>-->
          <el-button @click="dialogFormVisible = false" type="primary">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  let socket;

  export default {
    data() {
      return {
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
        },
        loading: false, //加载表格
        temp: {},
        username: '',
        bom: '',
        value: '',
        //分页组件
        totalrow: 0,
        currentPage: 1,
        pageSize: 4,

        user: {},
        // 实时订阅信息表单
        tableData: [],
        // 实时（attribute、connect、file）内容合集，
        contentArray: [],
        // 历史订阅消息
        tableData1: [],
        // 详细属性信息
        formAttribute: {
          parent: '',
          childKey: '',
          location: '',
          name: '',
          descript: '',
          builder: '',
          editor: '',
          editorTime: '',
          version: '',
          detail: '',
          propOne: '',
          propTwo: '',
          propThree: '',
          propFour: '',
          propFive: '',
          propSix: '',
          propSeven: '',
          propEight: '',
          propNine: '',
          propTen: '',
          propEleven: '',
          propTwelve: '',
          propThirteen: '',
          propFourteen: '',
          propFifteen: '',
          propSixteen: '',
          propSeventeen: '',
          propEighteen: '',
          propNineteen: '',
          propTwenty: '',
          titleId: 0,
        },
        attributeDateFromBackend:{
            parent: '',
            childKey: '',
            location: '',
            name: '',
            descript: '',
            builder: '',
            editor: '',
            editorTime: '',
            version: '',
            detail: '',
            propOne: '',
            propTwo: '',
            propThree: '',
            propFour: '',
            propFive: '',
            propSix: '',
            propSeven: '',
            propEight: '',
            propNine: '',
            propTen: '',
            propEleven: '',
            propTwelve: '',
            propThirteen: '',
            propFourteen: '',
            propFifteen: '',
            propSixteen: '',
            propSeventeen: '',
            propEighteen: '',
            propNineteen: '',
            propTwenty: '',
        },
        // 详细连接信息
        tableConnect: [],
        // 详细文件信息
        tableFile: [],
        //转换文件
        fileSwitch:[],
        //文件对象
        fileDate: {
          fileType: '',
          fileName: '',
          filePath: '',
          uploadTime: '',
          status: '',
          titleId: ''
        },
        //关联信息对象
        connectDate: {
          connectNodeName: '',
          connectNodeValue: '',
          connectRelation: '',
          connectTime: '',
          status: '',
          titleId: ''
        },
        // 详细信息页开关属性
        dialogFormVisible: false,
        // 分页组件
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
      }
    },
    created() {
      this.init();
      this.loadDDSTitle();
    },
    //离开当前页面后执行
    destroyed() {
      // 离开页面，将实时订阅信息存储到数据库（tableData和contentArray中的内容）
      console.log("离开页面了，存储信息！")
        for (let i = 0; i < this.tableData.length; i++) {
            this.store(i)
        }

    },

    methods: {

      //动态生成操作
      //储存进数据库
      store(index, row) {
        console.log("=================>"+"进入存储方法！")
        console.log("=================>"+index)
        this.loading = true
        // 将文件数据写入数据库
        this.tableFile = JSON.parse(this.contentArray[index].file)
        console.log("file文件", this.tableFile)
        for (let i = 0; i < this.tableFile.length; i++) {
          this.$http.post("/DDSFile/saveDDSFile", this.tableFile[i]).then(resp => {
              console.log("存入文件=========》",this.tableFile[index])
          })
        }
        //  将订阅数据写入数据库
        this.$http.post("/DDSTitle/saveTitle", this.tableData[index]).then(resp => {
          console.log("存入title信息=========>",this.tableData[index])
        })
        //将节点信息存入数据库
        this.attributeDateFromBackend = JSON.parse(this.contentArray[index].attribute);
        this.formAttribute.location = this.attributeDateFromBackend.location;
        this.formAttribute.parent = this.attributeDateFromBackend.parent;
        this.formAttribute.name = this.attributeDateFromBackend.name;
        this.formAttribute.descript = this.attributeDateFromBackend.descript;
        this.formAttribute.builder = this.attributeDateFromBackend.builder;
        this.formAttribute.editor = this.attributeDateFromBackend.editor;
        this.formAttribute.editorTime = this.attributeDateFromBackend.editorTime;
        this.formAttribute.version = this.attributeDateFromBackend.version;
        this.formAttribute.detail = this.attributeDateFromBackend.detail;
        this.formAttribute.propOne = this.attributeDateFromBackend.propOne;
        this.formAttribute.propTwo = this.attributeDateFromBackend.propTwo;
        this.formAttribute.propThree = this.attributeDateFromBackend.propThree;
        this.formAttribute.propFour = this.attributeDateFromBackend.propFour;
        this.formAttribute.propFive = this.attributeDateFromBackend.propFive;
        this.formAttribute.propSix = this.attributeDateFromBackend.propSix;
        this.formAttribute.propSeven = this.attributeDateFromBackend.propSeven;
        this.formAttribute.propEight = this.attributeDateFromBackend.propEight;
        this.formAttribute.propNine = this.attributeDateFromBackend.propNine;
        this.formAttribute.propTen = this.attributeDateFromBackend.propTen;
        this.formAttribute.propEleven = this.attributeDateFromBackend.propEleven;
        this.formAttribute.propTwelve = this.attributeDateFromBackend.propTwelve;
        this.formAttribute.propThirteen = this.attributeDateFromBackend.propThirteen;
        this.formAttribute.propFourteen = this.attributeDateFromBackend.propFourteen;
        this.formAttribute.propFifteen = this.attributeDateFromBackend.propFifteen;
        this.formAttribute.propSixteen = this.attributeDateFromBackend.propSixteen;
        this.formAttribute.propSeventeen = this.attributeDateFromBackend.propSeventeen;
        this.formAttribute.propEighteen = this.attributeDateFromBackend.propEighteen;
        this.formAttribute.propNineteen = this.attributeDateFromBackend.propNineteen;
        this.formAttribute.propTwenty = this.attributeDateFromBackend.propTwenty;
        // lwy 存储未成功原因，titleId未赋值
        this.formAttribute.titleId = this.attributeDateFromBackend.titleId;
        this.$http.post("/DDSBomDate/saveBomDate", this.formAttribute).then(resp => {
          console.log("存入attribute===========>",this.formAttribute)
        })
        this.tableConnect = JSON.parse(this.contentArray[index].connect)
        //将关联信息存入数据库
        for (let i = 0; i < this.tableConnect.length; i++) {
          this.$http.post("/DDSConnect/saveConnectDate", this.tableConnect[i]).then(resp => {
            console.log("存入connect信息=============<>",this.tableConnect[index])
          })
        }

        this.tableData.splice(index, 1)
        this.contentArray.splice(index, 1)
        this.findAllFile()
        this.loading = false
        this.loadDDSTitle();
      },


      // 查看历史订阅信息的详细信息
      look(index, row) {
        var id = row.id;
        console.log(id)
        this.postRequest("/DDSTitle/getConnectMessage?fileId=" + id).then(resp => {
          this.tableConnect = resp.data.connectMessage;
        })
        //  向后端请求关联文件表单
        this.postRequest("/DDSTitle/getConnectFile?fileId=" + id).then(resp => {
          this.tableFile = resp.data.connectFile;
        })
        this.getRequest("/DDSTitle/selectDDSBomData?fileId=" + id).then(resp => {
          if (resp && resp.status == 200) {
            // console.log(resp.data.DataDDSBomData.length)
            if (resp.data.DataDDSBomData.length == 0) {
              this.$message({
                type: 'faild',
                message: '查询失败，没有对应的的关联信息！'
              })
            } else {
              this.dialogFormVisible = true;
              this.formAttribute.parent = resp.data.DataDDSBomData[0].parent
              this.formAttribute.childKey = resp.data.DataDDSBomData[0].childKey
              this.formAttribute.name = resp.data.DataDDSBomData[0].name
              this.formAttribute.location = resp.data.DataDDSBomData[0].location
              this.formAttribute.descript = resp.data.DataDDSBomData[0].descript
              this.formAttribute.builder = resp.data.DataDDSBomData[0].builder
              this.formAttribute.editor = resp.data.DataDDSBomData[0].editor
              this.formAttribute.editorTime = resp.data.DataDDSBomData[0].editorTime
              this.formAttribute.version = resp.data.DataDDSBomData[0].version
              this.formAttribute.detail = resp.data.DataDDSBomData[0].detail
              this.formAttribute.propOne = resp.data.DataDDSBomData[0].propOne
              this.formAttribute.propTwo = resp.data.DataDDSBomData[0].propTwo
              this.formAttribute.propThree = resp.data.DataDDSBomData[0].propThree
              this.formAttribute.propFour = resp.data.DataDDSBomData[0].propFour
              this.formAttribute.propFive = resp.data.DataDDSBomData[0].propFive
              this.formAttribute.propSix = resp.data.DataDDSBomData[0].propSix
              this.formAttribute.propSeven = resp.data.DataDDSBomData[0].propSeven
              this.formAttribute.propEight = resp.data.DataDDSBomData[0].propEight
              this.formAttribute.propNine = resp.data.DataDDSBomData[0].propNine
              this.formAttribute.propTen = resp.data.DataDDSBomData[0].propTen
              this.formAttribute.propEleven = resp.data.DataDDSBomData[0].propEleven
              this.formAttribute.propTwelve = resp.data.DataDDSBomData[0].propTwelve
              this.formAttribute.propThirteen = resp.data.DataDDSBomData[0].propThirteen
              this.formAttribute.propFourteen = resp.data.DataDDSBomData[0].propFourteen
              this.formAttribute.propFifteen = resp.data.DataDDSBomData[0].propFifteen
              this.formAttribute.propSixteen = resp.data.DataDDSBomData[0].propSixteen
              this.formAttribute.propSeventeen = resp.data.DataDDSBomData[0].propSeventeen
              this.formAttribute.propEighteen = resp.data.DataDDSBomData[0].propEighteen
              this.formAttribute.propNineteen = resp.data.DataDDSBomData[0].propNineteen
              this.formAttribute.propTwenty = resp.data.DataDDSBomData[0].propTwenty
            }
          } else {
            this.$message({
              type: 'faild',
              message: '查询失败！'
            })
          }
        })

      },

      // 查看实时title详细页
      lookTitleDate(index, row, formName) {
        this.tableFile = [];
        this.tableConnect = [];
        this.formAttribute = {};

        this.tableFile = JSON.parse(this.contentArray[index].file)
        // this.formAttribute = JSON.parse(this.contentArray[index].attribute)
        this.attributeDateFromBackend = JSON.parse(this.contentArray[index].attribute);
        this.formAttribute.location = this.attributeDateFromBackend.location;
        this.formAttribute.parent = this.attributeDateFromBackend.parent;
        this.formAttribute.name = this.attributeDateFromBackend.name;
        this.formAttribute.descript = this.attributeDateFromBackend.descript;
        this.formAttribute.builder = this.attributeDateFromBackend.builder;
        this.formAttribute.editor = this.attributeDateFromBackend.editor;
        this.formAttribute.editorTime = this.attributeDateFromBackend.editorTime;
        this.formAttribute.version = this.attributeDateFromBackend.version;
        this.formAttribute.detail = this.attributeDateFromBackend.detail;
        this.formAttribute.propOne = this.attributeDateFromBackend.propOne;
        this.formAttribute.propTwo = this.attributeDateFromBackend.propTwo;
        this.formAttribute.propThree = this.attributeDateFromBackend.propThree;
        this.formAttribute.propFour = this.attributeDateFromBackend.propFour;
        this.formAttribute.propFive = this.attributeDateFromBackend.propFive;
        this.formAttribute.propSix = this.attributeDateFromBackend.propSix;
        this.formAttribute.propSeven = this.attributeDateFromBackend.propSeven;
        this.formAttribute.propEight = this.attributeDateFromBackend.propEight;
        this.formAttribute.propNine = this.attributeDateFromBackend.propNine;
        this.formAttribute.propTen = this.attributeDateFromBackend.propTen;
        this.formAttribute.propEleven = this.attributeDateFromBackend.propEleven;
        this.formAttribute.propTwelve = this.attributeDateFromBackend.propTwelve;
        this.formAttribute.propThirteen = this.attributeDateFromBackend.propThirteen;
        this.formAttribute.propFourteen = this.attributeDateFromBackend.propFourteen;
        this.formAttribute.propFifteen = this.attributeDateFromBackend.propFifteen;
        this.formAttribute.propSixteen = this.attributeDateFromBackend.propSixteen;
        this.formAttribute.propSeventeen = this.attributeDateFromBackend.propSeventeen;
        this.formAttribute.propEighteen = this.attributeDateFromBackend.propEighteen;
        this.formAttribute.propNineteen = this.attributeDateFromBackend.propNineteen;
        this.formAttribute.propTwenty = this.attributeDateFromBackend.propTwenty;
        this.tableConnect = JSON.parse(this.contentArray[index].connect)
        this.dialogFormVisible = true;
      },
      //查询所有文件
      findAllFile() {
        this.username = '';
        this.node = '';
        this.bom = '';
        this.value = ''
        this.currentPage = 1;
        this.pageSize = 4;
        this.loadDDSTitle();
      },

      findFileByName() {
        if ((this.username == '' || this.username == null) && (this.bom === '' || this.bom == null) && (this.value === '' || this.value == null)) {
          console.log("输入查询信息" + this.username + this.bom + this.value);
          this.$message({
            type: 'warning',
            message: '请输入查询信息作为查询条件！'
          })
        } else {
          console.log("输入查询信息" + this.username + this.bom + this.value);
          this.loadDDSTitle();
        }
      },

      //删除DDSTitle指定行
      deleteRow(index, row) {
        var id = row.id;
        console.log(id + "SSSSS")
        this.postRequest("/DDSTitle/deleteDDSTitle?fileId=" + id).then(resp => {
          if (resp && resp.status == 200) {
            this.loadDDSTitle();
          } else {
            this.$message({
              type: 'faild',
              message: '文件删除失败！'
            })
          }
        })
      },


      // 打开页面实现 加载历史订阅信息
      loadDDSTitle() {
        this.loading = true;
        this.getRequest("/DDSTitle/getDDSTitle?page=" + this.currentPage + "&size=" + this.pageSize + "&username=" + this.username + "&bom=" + this.bom + "&value=" + this.value).then(resp => {
          if (resp && resp.status == 200) {
            this.tableData1 = resp.data.DataTitle;
            this.totalrow = resp.data.CountTitle;
            this.loading = false;
          } else {
            this.$message({
              type: 'faild',
              message: '查询失败！'
            })
          }
        })
      },

      confirmStatus(status) {
        if (status === 0) {
          return "删除"
        } else if (status === 1) {
          return "新增"
        } else {
          return "修改"
        }
      },
      confirmStatusType(status) {
        if (status === 0) {
          return "warning"
        } else if (status === 1) {
          return "success"
        } else {
          return "primary"
        }
      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      ss() {
        console.log("打印节点对象========>" + "最新编译");
        //模拟DDS发布数据
        var jsonStr = {"DDSattribute":"{\"parent\":\"D0-0\",\"titleId\":398,\"childKey\":\"[B0,B0-0,0]\",\"builder\":\"1\",\"id\":\"672\",\"state\":\"1\",\"value\":\"D0-0-0\",\"editor\":\"1\",\"editorTime\":\"1\",\"label\":\"1\",\"version\":\"1.1\",\"name\":\"1\",\"location\":\"3\",\"detail\":\"1\",\"descript\":\"1\",\"propOne\":\"1\",\"propTwo\":\"1\"}","DDSconnect":"[{\"connectNodeName\":\"A型火箭StBOM火箭细化技术性能指标\",\"connectTime\":\"2022/10/19-21:13:59\",\"connectNodeValue\":\"B0-0-0\",\"titleId\":398,\"id\":0,\"connectRelation\":\"遗传映射关系\",\"status\":2}]","DDSfile":"[{\"fileName\":\"2022-10-19-21-14开启命令.txt\",\"filePath\":\"C:/Xbom/File/2022-10-19-21-14开启命令.txt\",\"titleId\":398,\"id\":0,\"uploadTime\":\"2022/10/19-21:14:32\",\"fileType\":\".txt\",\"status\":2}]","bom":"MBom","id":398,"maker":"2020001","name":"1","status":2,"time":"2022-10-19 21:14:33","value":"D0-0-0"}
        console.log(jsonStr)
     ;
        if (jsonStr.id !== undefined && jsonStr.id !== 0) {
            // 存入合集对象   contentArray
            var contentData = {
                id: 0,
                attribute: '',
                connect: '',
                file: '',
            }

            contentData.id = jsonStr.id
            contentData.attribute = jsonStr.DDSattribute
            contentData.connect = jsonStr.DDSconnect
            console.log(JSON.parse(jsonStr.DDSfile)[0].filename)
            for (let i = 0; i < JSON.parse(jsonStr.DDSfile).length; i++) {
                this.fileDate.fileName = JSON.parse(jsonStr.DDSfile)[i].filename
                this.fileDate.fileType = JSON.parse(jsonStr.DDSfile)[i].filetype
                this.fileDate.filePath = JSON.parse(jsonStr.DDSfile)[i].filepath
                this.fileDate.uploadTime = JSON.parse(jsonStr.DDSfile)[i].uploadtime
                this.fileDate.titleId = JSON.parse(jsonStr.DDSfile)[i].titleId
                this.fileSwitch[i] = this.fileDate
            }
            contentData.file = JSON.stringify(this.fileSwitch)
            console.log(contentData.file)
            if(contentData.id !== 0){
                this.contentArray.push(contentData);
            }
            console.log("=========》", this.contentArray)

            // 存入title对象   tableData
            // 创建对象及属性，否则不准属性set赋值
            var titleData = {
                id: 0,
                username: '',
                time: '',
                status: 0,
                bom: '',
                changeName: '',
                value: '',
            }
            titleData.id = jsonStr.id
            titleData.username = jsonStr.maker
            titleData.time = jsonStr.time
            titleData.status = jsonStr.status
            titleData.bom = jsonStr.bom
            titleData.changeName = jsonStr.name
            titleData.value = jsonStr.value
            this.tableData.push(titleData)
            console.log("=========》", this.tableData)
        }



        console.log("打印节点数组=========》", this.tableData);
        console.log("打印内容数组=========》", this.contentArray);
      },

      //当前页
      handleCurrentChange1: function (currentPage) {
        console.log("SSSSS" + currentPage)
        this.currentPage = currentPage;
        this.loadDDSTitle();
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },


      // websocket
      // socket 初始化
      init() {
        this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
        let name = this.user.username;
        let intepart = this.user.intepart;
        // username 是用户名和用户部门一起的字符串
        let username = name+","+intepart;
        console.log("username=========>"+username)
        let _this = this;
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          let socketUrl = "ws://localhost:8990/imserver/" + username;
          if (socket != null) {
            socket.close();
            socket = null;
          }
          // 开启一个websocket服务
          socket = new WebSocket(socketUrl);
          // 打开事件（对应后端OnOpen）
          socket.onopen = function () {
            console.log("websocket已打开");
          };

          // 浏览器端收消息，获得从服务端发送过来的文本消息
          socket.onmessage = function (msg) {
            console.log("收到订阅数据====" + msg.data)
            // 获得传过来的JSON对象
            var jsonStr = JSON.parse(msg.data)

            // 对订阅信息进行解析（不是订阅信息不解析）
            if (jsonStr.id !== undefined && jsonStr.id !== 0) {
              // 存入合集对象   contentArray
              var contentData = {
                  id: 0,
                  attribute: '',
                  connect: '',
                  file: '',
              }

              contentData.id = jsonStr.id
              contentData.attribute = jsonStr.DDSattribute
              contentData.connect = jsonStr.DDSconnect
              contentData.file = jsonStr.DDSfile
              if(contentData.id !== 0){
                _this.contentArray.push(contentData);
              }
              console.log("=========》", _this.contentArray[0])
              console.log("=========》", _this.contentArray[0].id)

              // 存入title对象   tableData
              // 创建对象及属性，否则不准属性set赋值
              var titleData = {
                id: 0,
                username: '',
                time: '',
                status: 0,
                bom: '',
                changeName: '',
                value: '',
              }
              titleData.id = jsonStr.id
              titleData.username = jsonStr.maker
              titleData.time = jsonStr.time
              titleData.status = jsonStr.status
              titleData.bom = jsonStr.bom
              titleData.changeName = jsonStr.name
              titleData.value = jsonStr.value
              _this.tableData.push(titleData)
              console.log("=========》", _this.tableData)
              console.log("=========》", _this.tableData[0].id)
            }

          };

          //关闭事件
          socket.onclose = function () {
            console.log("websocket已关闭");
          };
          //发生了错误事件
          socket.onerror = function () {
            console.log("websocket发生了错误");
          }
        }
      }
    },


  }
</script>

<style>
  /*
  .item: 是绑定class的
  .el-form-item__label: 自动匹配form表单中label的(注意:中间是连续的两个'_')
  */
  .itemDelete .el-form-item__label{
    /*text-decoration:line-through;*/
    /*color: #409EFF;*/
    color: #000000;
    font-weight: bold;
  }

  .itemRevise .el-form-item__label{
    color: #000000;
    font-weight: bold;
  }

  .itemAdd .el-form-item__label{
    color: #000000;
    font-weight: bold;
  }
  .prop .el-form-item__label{
    color: #409EFF;
    font-weight: bold;
  }

</style>
