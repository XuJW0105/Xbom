<template>
  <div class="tree-contanier" id="tree" ref="treeContainer">
    <h2 style="margin-top: 5px;color: #124880;">|&emsp;DfBOM（定义BOM）结构树</h2>
    <el-row>
      <el-col :span="24" class="chart chart_left">
        <div id="treeChart" style="height: 450px">DfBOM（定义BOM）结构树加载失败</div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h2 style="float: left; margin-top:5px;color: #124880;">|&emsp;DfBOM（定义BOM）数据表格</h2>
    <div style="float: right;margin-right: 10px;">
      <!-- <el-button type="primary" size="small" @click="">上传BOM数据</el-button> -->
      <el-button type="primary" size="small" @click="handleCreate" icon="el-icon-circle-plus-outline"
                 style="margin: 10px 0;color:#F5F5F5;font-weight: 700;">创建节点
      </el-button>
      <el-button @click="submitChange()" type="success" size="small"
                 style="margin: 10px 0;color:#F5F5F5;font-weight: 700;">完成更改请求
      </el-button>
    </div>

    <el-table :data="tableData.filter(data => !search || data.descript.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%; margin-bottom: 20px" border ref="deptTab" highlight-current-row
              :header-cell-style="{background: 'rgb(68, 206, 206)',color:'rgb(255, 255, 255)',weight:'700'}"
              row-key="id"
              stripe size="medium" :expand-row-keys="['1']" :tree-props="{ children: 'children'}">
      <el-table-column prop="name" label="名称" width="250">
      </el-table-column>
      <el-table-column prop="location" label="层级" width="80"></el-table-column>
      <el-table-column prop="descript" label="描述" width="150"></el-table-column>
      <el-table-column prop="builder" label="创建者" width="80"></el-table-column>
      <el-table-column prop="editor" label="编辑者" width="80"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间" width="180"></el-table-column>
      <el-table-column prop="version" label="版本" width="80"></el-table-column>
      <el-table-column prop="detail" label="数据详情">
<!--        <template slot-scope="scope">-->
<!--          <a  target="_blank" -->
<!--             :underline="false">{{scope.row.detail}}</a>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column label="操作" :align="alignDir" width="320" fixed="right">
        <!--        <template slot="header" slot-scope="scope">-->
        <!--          <el-input-->
        <!--            v-model="search"-->
        <!--            size="mini"-->
        <!--            placeholder="输入关键字搜索"/>-->
        <!--        </template>-->
        <template slot-scope="scope">

          <!-- <el-button type="text" size="small" @click="handleLookTree(scope.row)">查看信息</el-button> -->

          <el-button @click="sendrequestChange(scope.row)" type="success" size="small">请求变更
          </el-button>
          <!--  标记框-->
          <el-badge value="结构关系" v-if="scope.row.state=='1'&&scope.row.label=='1'"
                    style="margin-top: 8px;margin-right: 5px;margin-left: 5px;">
            <el-button @click="handleUpdate(scope.$index,scope.row)" type="primary" size="small">编辑
            </el-button>
          </el-badge>
          <el-badge value="关联关系" v-if="scope.row.state=='1'&&scope.row.label=='2'"
                    style="margin-top: 8px;margin-right: 5px;margin-left: 5px;" type="warning">
            <el-button @click="handleUpdate(scope.$index,scope.row)" type="primary" size="small">编辑
            </el-button>
          </el-badge>
          <el-button v-else-if="scope.row.state=='1'&&scope.row.label=='0'"
                     @click="handleUpdate(scope.$index,scope.row)" type="primary" size="small">编辑
          </el-button>

          <el-button @click="handleUpdate(scope.$index,scope.row)" type="text" size="small"
                     v-else-if="scope.row.state=='0'" disabled>编辑禁止
          </el-button>
          <el-button type="text" size="small" @click="handleLookTree(scope.$index,scope.row)">查看信息</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 新增和编辑节点的弹窗开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%" @closed="closeAdd">
      <div style="float: left;margin-left: 10px;">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" :inline="true" style="margin-left: 50px">
          <el-form-item label="层级：" prop="location" v-if="dialogStatus !== 'update'"
                        :label-width="formLabelWidth">
            <el-select v-model="temp.location" placeholder="请选择层级" @change="locationChange" size="small"
                       style="width: 200px">
              <el-option v-for="item in locationData" :key="item.id" :label="item.name02"
                         :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="sonStatus && dialogStatus == 'create'" label="子位置：" prop="children"
                        :label-width="formLabelWidth" :label-positon="labelPositon">
            <el-cascader size="small" :key="isResouceShow" v-model="temp.children" placeholder="请选择子位置"
                         :options="tableData" :props="TagProps" clearable @change="getCasVal"></el-cascader>
          </el-form-item>
          <el-form-item label="标签名称：" prop="name" :label-width="formLabelWidth">
            <el-input v-model="temp.name" size="small" autocomplete="off" placeholder="请输入标签名称"
                      style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="descript" :label-width="formLabelWidth">
            <el-input v-model="temp.descript" size="small" autocomplete="off" placeholder="请输入描述"
                      style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="创建者：" prop="builder" :label-width="formLabelWidth">
            <el-input v-model="temp.builder" size="small" autocomplete="off" placeholder="请输入创建者"
                      style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="编辑者：" prop="editor" :label-width="formLabelWidth">
            <el-input v-model="temp.editor" size="small" autocomplete="off" placeholder="请输入编辑者"
                      style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="编辑时间：" prop="editorTime" :label-width="formLabelWidth">
            <el-input v-model="temp.editorTime" size="small" autocomplete="off" placeholder="请输入编辑时间"
                      style="width: 200px">
            </el-input>

          </el-form-item>
          <el-form-item label="版本号：" prop="version" :label-width="formLabelWidth">
            <el-select v-model="temp.version" placeholder="请选择版本" style="width: 200px" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-input v-model="temp.version" size="small" autocomplete="off" placeholder="请输入版本"></el-input> -->
          </el-form-item>

          <el-form-item label="数据详情：" prop="detail" :label-width="formLabelWidth">
            <el-input v-model="temp.detail" size="small" autocomplete="off" placeholder="请输入数据详情"
                      style="width: 200px"></el-input>
          </el-form-item>


          <div  v-if="dialogStatus !== 'create'">
            <el-table :data="connectInfoTable" border style="width: 95%;margin-top: 10px;">
              <!-- <el-table-column prop="connectId" fixed label="" width="120">
              </el-table-column> -->
              <el-table-column prop="connectNodeName" label="关联节点的名称" width="300">
              </el-table-column>
              <el-table-column prop="connectNodeValue" label="内编码值" width="200">
              </el-table-column>
              <el-table-column prop="connectRelation" label="关联关系" width="150">
              </el-table-column>
              <el-table-column prop="connectTime" label="关联时间" ></el-table-column>
<!--              <el-table-column label="操作" :align="alignDir" width="320" fixed="right">-->
<!--                <template slot-scope="associationscope">-->
<!--                  <el-button @click="associationChange(associationscope.row)" type="success"-->
<!--                             size="small">修改关联关系-->
<!--                  </el-button>-->
<!--                  <el-button @click="associationDelete(associationscope.row)" type="success"-->
<!--                             size="small">删除关联关系-->
<!--                  </el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
            </el-table>
            <el-table :data="fileDataTable" v-loading="loadingFile" border
                      style="width: 95%;margin-top: 10px;"
            :key = "fileFlash">
              <!-- <el-table-column prop="datatype" label="数据文件种类" width="200px">
        </el-table-column> -->
              <el-table-column prop="filename" label="本BOM数据节点下文件名" width="190px">
              </el-table-column>
              <el-table-column prop="filetype" label="文件类型" width="80px">
              </el-table-column>
              <el-table-column prop="filepath" label="文件地址" width="100px">
              </el-table-column>
              <el-table-column prop="uploadtime" label="文件上传时间">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                  <div style="float: right;margin-right: 10px;" v-if="dialogStatus !== 'look'">
                    <el-button @click="downLoadFile(scope.$index, scope.row)" type="primary"
                               size="small">下载
                    </el-button>
                  </div>
                  <div style="float: right;margin-right: 10px;" v-if="dialogStatus !== 'look'">
                    <el-popconfirm confirmButtonText='确定删除' cancelButtonText='不用了'
                                   icon="el-icon-info" iconColor="red" title="确定将该文件删除吗？"
                                   @confirm="deleteFile(scope.$index, scope.row)">
                      <el-button slot="reference" type="danger" size="small">删除</el-button>
                    </el-popconfirm>
                  </div>
                  <div style="display: flex;float: right; margin-right: 10px;">
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件开始 -->
            <div style="margin-top: 10px;">
              <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background
                             layout="prev, pager, next"
                             :total="totalrow" :page-size="pageSize">
              </el-pagination>
            </div>
            <!-- 分页组件结束 -->
          </div>
          <el-divider></el-divider>
          <div style="margin-left: -35px;margin-top: 10px;" v-if="dialogStatus == 'look'">
            <div style="float: left;margin-left: 0px;margin-top: 0px;"
                 v-show="temp.propOne == ''||temp.propOne == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propTwo" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propOne}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 0px;"
                 v-show="temp.propThree== ''||temp.propThree == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propFour" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propThree}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propFive== ''||temp.propFive == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propSix" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propFive}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propSeven== ''||temp.propSeven == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propEight" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propSeven}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propNine == ''||temp.propNine == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propTen" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propNine}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propEleven == ''||temp.propEleven == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propTwelve" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propEleven}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propThirteen == ''||temp.propThirteen == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propFourteen"
                        style="margin-left: 45px;width: 255px;" size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propThirteen}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propFifteen == ''||temp.propFifteen == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propSixteen" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propFifteen}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propSeventeen == ''||temp.propSeventeen == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propEighteen"
                        style="margin-left: 45px;width: 255px;" size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propSeventeen}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
            <div style="float: left;margin-left: 0px;margin-top: 10px;"
                 v-show="temp.propNineteen == ''||temp.propNineteen == null ? false :true ">
              <!-- <v-if > -->
              <el-input placeholder="请输入内容" v-model="temp.propTwenty" style="margin-left: 45px;width: 255px;"
                        size="small">
                <template slot="prepend" style="width: 200px;">{{temp.propNineteen}}</template>
              </el-input>
              <!-- </v-if> -->
            </div>
          </div>
        </el-form>
        <!--        分割线-->
        <div style="margin-top: -30px;" v-if="dialogStatus == 'create'">
          <el-divider></el-divider>
        </div>
        <div style="float: left;margin-left:0px;" v-if="dialogStatus !== 'look'">
          <el-form :inline="true" :model="form" ref="form" style="margin-top: 3%">
            <div v-for="(item, index) in form.head" :key="index" style="float: left;margin-left:2.5%;">
              <el-form-item label="属性名称:" :label-width="formLabelWidth"
                            :prop="`head[${index}].productName`">
                <el-input v-model="item.productName" clearable autocomplete="off" size="small"
                          style="width: 200px;margin-left:47px"
                          placeholder="请输入属性名称"></el-input>
              </el-form-item>
              <el-form-item label="属性内容:" :label-width="formLabelWidth"
                            :prop="`head[${index}].productContent`">
                <el-input v-model="item.productContent" clearable autocomplete="off" size="small"
                          style="width: 200px;margin-left:0px" placeholder="请输入属性内容"></el-input>
                  <el-button type="danger" @click="del_head(index)"
                             size="small">删除属性信息
                  </el-button>
              </el-form-item>

              <div style="float: left;margin-left:3%;width: 100%;">
                <el-button type="primary" @click="add_head" v-show="(form.head.length == index + 1)" size="small">
                  添加属性信息
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 选择DfBOM节点属性开始 -->
      <div style="float: left;margin-left:45px;width: 98%" v-if="dialogStatus == 'create'">
        <h4 style="margin-top: 5px;color: #124880;">|&emsp;若该节点不是独立新增，请选择以下BOM的节点进行关联</h4>
        <div style="margin-top: 10px;">
          <el-button type="primary" @click="handleConnectNode" size="small">
            选择本BOM（DfBOM）的节点
          </el-button>
          <el-button type="primary" @click="handleConnectNodeOut" size="small">
            选择外部应用数据库的节点
          </el-button>
          <!-- <el-form-item label="请选择关联关系：" prop="version" :label-width="formLabelWidth"> -->

          <!-- </el-form-item> -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: 50px">


        <el-upload class="upload-demo inline-block" ref="upload" :multiple="true"
                   accept=".xlsx,.xls,.csv,.txt,.pdf,.dwg,.zip,.doc,.docx,.ppt,.pptx,.rar"
                   action="/BOMFile/dataFile/uploadDfBomFile" :on-preview="handlePreview" :on-change="handleChange"
                   :before-remove="beforeRemove" :on-remove="handleRemove" :limit="2" :on-exceed="handleExceed"
                   :before-upload="beforeUpload" :on-success="upLoadSucceed" :on-error="upLoadError"
                   :file-list="fileList" :http-request="uploadFile" enctype="multipart/form-data" :auto-upload="false"
                   :show-file-list="false" v-if="dialogStatus !== 'look'">
          <el-button slot="trigger" size="small" type="primary" style="margin-left: 4px;"
                     :loading="logining1" v-if="dialogStatus == 'update'">选取文件
          </el-button>
          <el-button style="float: right; margin-left: 4px;" size="small" type="success"
                     @click="uploadFile(temp)" :loading="logining2" v-if="dialogStatus == 'update'">上传
          </el-button>
<!--          <el-button size="small" type="success"-->
<!--                     :loading="logining2">发布数据-->
<!--          </el-button>-->
        </el-upload>
        <el-button @click="deleltedata(temp)" type="danger" size="small" v-if="dialogStatus == 'update'">删除节点
        </el-button>
        <!-- <el-button @click="" type="primary" size="small" v-if="dialogStatus !== 'create'">
          查看节点详细信息请下载源文件
        </el-button> -->
        <el-button @click="dialogFormVisible = false" size="small">
          取消
        </el-button>
        <el-button type="primary" size="small" @click="updateData(temp)" v-if="dialogStatus == 'update'">
          确认修改
        </el-button>
        <el-button type="primary" size="small" @click="createData()" v-if="dialogStatus == 'create'">
          确认
        </el-button>
        <el-button type="primary" size="small" @click="cancelupdateData()" v-if="dialogStatus == 'look'">
          确认
        </el-button>
      </div>
    </el-dialog>


    <!-- 选择关联节点信息和数据开始DfBOM数据节点查看 -->
    <el-dialog title="关联关系添加页面" :visible.sync="visitDfBOM" width="85%" :before-close="handleClose" >
      <!-- <h4>关联节点选择</h4> -->
      <h3 style="font-weight: 700;color: #0D5599;margin-bottom: 10px;">| 请选择定义BOM(DfBOM)中需要关联的节点位置：</h3>
      <div>
        <el-cascader ref="cascaderMallCatergory" size="medium" :key="isResouceShow" v-model="temp.children2"
                     placeholder="请选择,可输入关键字进行搜索" :options="tableDfBomData" :props="DfTagProps" clearable filterable
                      class="elcascader"></el-cascader>
        <!-- </el-form-item> -->
        <el-select v-model="connectRelationSelect" ref="mySelected" placeholder="选择关联关系" style="width: 150px"
                   size="medium">
          <el-option v-for="item in connectOptions" :key="item.connectValue" :label="item.connectLabel"
                     :value="item.connectValue">
          </el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="handleMallCatergoryChange">查看节点属性信息</el-button>
      </div>
      <!-- <el-divider></el-divider> -->
      <div style="float: left;margin-left: 0px;margin-top: 1%;">
        <div style="float: left;margin-left: 0px"
             v-show="dfBomInfo.propOne == ''||dfBomInfo.propOne == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propTwo" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propOne}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 0px;"
             v-show="dfBomInfo.propThree== ''||dfBomInfo.propThree == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propFour" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propThree}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <br>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propFive== ''||dfBomInfo.propFive == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propSix" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propFive}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propSeven== ''||dfBomInfo.propSeven == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propEight" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propSeven}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <br>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propNine == ''||dfBomInfo.propNine == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propTen" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propNine}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propEleven == ''||dfBomInfo.propEleven == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propTwelve" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propEleven}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <br>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propThirteen == ''||dfBomInfo.propThirteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propFourteen"
                    style="margin-left: 0px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propThirteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propFifteen == ''||dfBomInfo.propFifteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propSixteen"
                    style="margin-left: 20px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propFifteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <br>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propSeventeen == ''||dfBomInfo.propSeventeen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propEighteen"
                    style="margin-left: 0px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propSeventeen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="dfBomInfo.propNineteen == ''||dfBomInfo.propNineteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="dfBomInfo.propTwenty" style="margin-left:20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{dfBomInfo.propNineteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
      </div>

      <div style="margin-top: 10px;margin-left: 75%">

				<span slot="footer" class="dialog-footer">
					<el-button @click="connectDfBom" size="small" type="primary">关联节点信息</el-button>
				</span>
      </div>
    </el-dialog>
    <!-- 选择关联节点信息和数据结束 -->

    <!-- 选择外部关联节点信息和数据开始-->
    <el-dialog title="关联关系添加页面" :visible.sync="visitOutBOM" width="85%" :before-close="handleClose">
      <!-- <h4>关联节点选择</h4> -->
      <h3 style="font-weight: 700;color: #0D5599;margin-bottom: 10px;">| 请选择外部应用数据中需要关联的节点位置：</h3>
      <!-- <el-form-item  label="请选择定义BOM(DfBOM)的节点位置：" -->
      <!-- prop="children" :label-width="formLabelWidth" :label-positon="labelPositon"> -->
      <el-cascader ref="cascaderMallCatergoryOut" size="medium" :key="isResouceShow" v-model="temp.children3"
                   placeholder="请选择,可输入关键字进行搜索" :options="tableOutBomData" :props="OutTagProps" clearable filterable
                   class="elcascader"></el-cascader>
      <!-- </el-form-item> -->
      <el-select v-model="connectRelationSelect" ref="mySelectedOut" placeholder="选择关联关系" style="width: 150px"
                 size="medium">
        <el-option v-for="item in connectOptions2" :key="item.connectValue" :label="item.connectLabel"
                   :value="item.connectValue">
        </el-option>
      </el-select>
      <el-button type="primary" size="medium" @click="handleMallCatergoryChangeOut">查看节点属性信息</el-button>
      <!-- <el-divider></el-divider> -->
      <div style="float: left;margin-left: 0px;margin-top: 20px;margin-bottom: 10px;">
        <div style="float: left;margin-left: 0px;margin-top: 0px;"
             v-show="outBomInfo.propOne == ''||outBomInfo.propOne == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propTwo" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propOne}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 0px;"
             v-show="outBomInfo.propThree== ''||outBomInfo.propThree == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propFour" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propThree}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propFive== ''||outBomInfo.propFive == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propSix" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propFive}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propSeven== ''||outBomInfo.propSeven == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propEight" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propSeven}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propNine == ''||outBomInfo.propNine == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propTen" style="margin-left: 0px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propNine}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propEleven == ''||outBomInfo.propEleven == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propTwelve" style="margin-left: 20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propEleven}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propThirteen == ''||outBomInfo.propThirteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propFourteen"
                    style="margin-left: 0px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propThirteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propFifteen == ''||outBomInfo.propFifteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propSixteen"
                    style="margin-left: 20px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propFifteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propSeventeen == ''||outBomInfo.propSeventeen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propEighteen"
                    style="margin-left: 0px;width: 400px;" size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propSeventeen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
        <div style="float: left;margin-left: 0px;margin-top: 10px;"
             v-show="outBomInfo.propNineteen == ''||outBomInfo.propNineteen == null ? false :true ">
          <!-- <v-if > -->
          <el-input placeholder="请输入内容" v-model="outBomInfo.propTwenty" style="margin-left:20px;width: 400px;"
                    size="small">
            <template slot="prepend" style="width: 200px;">{{outBomInfo.propNineteen}}</template>
          </el-input>
          <!-- </v-if> -->
        </div>
      </div>

      <div style="margin-left: 75%;margin-top: 10px">

				<span slot="footer" class="dialog-footer">

					<el-button @click="connectOutBom" size="small" type="primary">关联该节点</el-button>
          <!-- <el-button type="primary" @click="sentConnectInfo">关联BOM节点</el-button> -->
				</span>
      </div>
    </el-dialog>
    <!-- 选择外部关联节点信息和数据结束 -->

    <!-- 查看信息弹窗开始 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogTreeVisible" width="80%">
      <h2>当前选中的产品的信息</h2>
      <el-row>
        <el-col :span="24" class="chart chart_left">
          <!-- <div id="treeChart02" style="height: 450px" >图表加载失败</div> -->
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelupdateData()" size="small">
          取消
        </el-button>
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 查看信息弹窗结束 -->

    <!-- 查看跨BOM关联关系-->
    <el-dialog title="其他BOM关联节点数据" :visible.sync="dialogTableVisibleOtherBomTips" width="60%">
      <div v-if="DfBOM.length!= 0">
        <h3 style="color: #0D5599">DfBOM节点信息</h3>
        <el-table :data="DfBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="StBOM.length!= 0">
        <h3 style="color: #0D5599;margin-top: 20px">StBOM节点信息</h3>
        <el-table :data="StBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="EBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">EBOM节点信息</h3>
        <el-table :data="EBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="MBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">MBOM节点信息</h3>
        <el-table :data="MBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="BBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">BBOM节点信息</h3>
        <el-table :data="BBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="DBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">DBOM节点信息</h3>
        <el-table :data="DBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="SBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">SBOM节点信息</h3>
        <el-table :data="SBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="OBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">OBOM节点信息</h3>
        <el-table :data="OBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>
      <div v-if="OutBOM.length!= 0 ">
        <h3 style="color: #0D5599;margin-top: 20px">OBOM节点信息</h3>
        <el-table :data="OBOM">
          <el-table-column property="connect_node_name" label="节点名称" width="500"></el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogTableVisibleOtherBomTipsClose()">确 定</el-button>
  </span>
    </el-dialog>

    <!--    查看跨BOM关联关系结束-->
  </div>
</template>

<script>
    import echarts from 'echarts'
    import fileURLStore from '../../store/fileURLList/fileURLList.js'

    export default {
        name: 'tree',
        data() {
            return {
                fileFlash:0,
                // 跨bom提示数据
                OtherBomTipsdata: [],
                dialogTableVisibleOtherBomTips: false,
                BBOM: [],
                DBOM: [],
                DfBOM: [],
                EBOM: [],
                MBOM: [],
                OBOM: [],
                SBOM: [],
                StBOM: [],
                OutBOM:[],
                form: {
                    head: [{
                        productName: "",
                        productContent: "",
                    }]
                },
                search: '',
                input1: '',
                labelPositon: 'left',
                formLabelWidth: '100px',
                options: [{
                    value: '1.1',
                    label: '版本1.1'
                }, {
                    value: '1.2',
                    label: '版本1.2'
                }, {
                    value: '1.3',
                    label: '版本1.3'
                }, {
                    value: '1.4',
                    label: '版本1.4'
                }, {
                    value: '1.5',
                    label: '版本1.5'
                }, {
                    value: '2.1',
                    label: '版本2.1'
                }, {
                    value: '2.2',
                    label: '版本2.2'
                }, {
                    value: '2.3',
                    label: '版本2.3'
                }, {
                    value: '2.4',
                    label: '版本2.4'
                }, {
                    value: '2.5',
                    label: '版本2.5'
                }],
                value: '',
                tableDataTxt: {
                    message: '',
                    otherInfo: '',
                },
                oneBomDataTxt: {
                    childKey: '',
                    name: '',
                    parent: '',
                    location: '',
                    value: '',
                    descript: '',
                    builder: '',
                    editor: '',
                    editorTime: '',
                    version: '',
                    detail: '',
                    formJson: '',
                },
                updateOneDataTxt: {
                    message: '',
                    otherInfo: '',
                },
                connectDfInfoText: {
                    connectInfoListText: '',
                    connectInfoId: '',
                },
                connectInfoList: [],
                TagProps: {
                    // multiple: true,
                    value: 'value',
                    label: 'name',
                    checkStrictly: true,
                },
                DfTagProps: {
                    // multiple: true,
                    value: 'value',
                    label: 'name',
                    checkStrictly: true,
                },
                OutTagProps: {
                    // multiple: true,
                    value: 'value',
                    label: 'name',
                    checkStrictly: true,
                },
                searchMap: {},
                type: 0,
                quDataValue: "A",
                queryType: 0,
                queryValue: "A",
                domainInfoLists: [],
                mapData: [],
                haschild: true,
                checkouts: false,
                // tableData:[],
                data01: [],
                //对应表格的数据
                //层级表格的可视化
                cutSetArr: '',
                probability: '',
                probabilityNum: '',
                isVertical: false, // 是否是竖方向,只给最外层的添加
                isDetail: false, // 是否是详情,不可编辑操作
                dialogVisible: false, // 添加股东弹框
                dialogVisible2: false, // 删除提示弹框
                confirmEdit: false,
                ruleForm: {
                    type: 1,
                    partnerName: "",
                    proportionShares: null
                },
                currentTreeData: {},
                alignDir: 'center',
                textMap: {
                    update: '编辑定义BOM(DfBOM)节点信息',
                    create: '添加定义BOM(DfBOM)节点信息',
                },
                dialogStatus: '',
                dialogFormVisible: false,
                dialogTreeVisible: false,
                temp: {},
                isResouceShow: 1,
                sonStatus: false,
                casArr: [],
                idx: '',
                childKey: [],
                rules: {
                    location: [{
                        required: true,
                        message: '请选择层级',
                        trigger: 'blur',
                    },],
                    children: [{
                        required: true,
                        message: '请选择子位置',
                        trigger: 'blur',
                    },],
                    name: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    },],
                    descript:[{
                        required: true,
                        message: '请输入描述内容，若没有描述输入无',
                        trigger: 'blur',
                    }],
                    builder:[{
                        required: true,
                        message: '请输入创建者',
                        trigger: 'blur',
                    }],
                    editor:[{
                        required: true,
                        message: '请输入编辑者',
                        trigger: 'blur',
                    }],
                    editorTime:[{
                        required: true,
                        message: '请输入编辑时间',
                        trigger: 'blur',
                    }],
                    version:[{
                        required: true,
                        message: '请输入版本号',
                        trigger: 'blur',
                    }],
                    detail:[{
                        required: true,
                        message: '请输入数据详情，若没有则输入无',
                        trigger: 'blur',
                    }],
                },
                locationData: [
                    // {
                    //                id: '1',
                    //                name02: '顶级',
                    //            },
                    {
                        id: '2',
                        name02: '子级',
                    },
                ],
                tableData: [],
                tableDataRetrun: '',
                conDfBomId: '',
                fileName: '',
                fileProcessName: '',
                loading: false,
                loadingFile: false,
                currentPageProcess: 1,
                pageSizeProcess: 4,
                dialogVisitFile: false,
                fileList: [],
                fileURLList: [],
                visitDfBOM: false,
                visitOutBOM: false,
                dfBomInfo: {},
                outBomInfo: {},
                tableDfBomData: [],
                tableOutBomData: [],
                dfBomArray: [],
                outBomArray: [],
                logining1: false,
                logining2: false,
                connectOptions: [{
                    connectValue: '遗传映射关系',
                    connectLabel: '遗传映射关系'
                }, {
                    connectValue: '变异映射关系',
                    connectLabel: '变异映射关系'
                }, {
                    connectValue: '综合映射关系',
                    connectLabel: '综合映射关系'
                }],
                connectOptions2:[{
                  connectValue: '外部应用转换',
                  connectLabel: '外部应用转换'
                }],
                dfBomArrayElement: [],
                dfBomArrayElementValue: [],
                connectRelationSelect: '',
                connectInfoTable: [],
                /*
                    查看数据页面
                    */
                //数据对应表格的数据
                //拿到的上下级数据（用于判断标记框使用）
                SuperAndInfer: [],
                //更改传输的对象
                editTempData: [],
                //结构树new标签字段
                isnewData: [],
                k: 0,
                /*
                弹窗显示数据部分
                */
                // 查看弹窗对应数据（包括更改数据表单）
                showdateform: [],
                // 查看窗口弹窗
                showdatadialogVisible: false,
                //数据源文件分页
                fileDataTable: [],
                totalrow: 0,
                currentPage: 1,
                pageSize: 4,
                fileValue: '',
            }
        },
        mounted() {
            // this.getTableData();
            this.getTableDataLate();
            this.loadFileForm();
            // this.showDeptTab();
        },
        methods: {

            // lwy  关闭新增页面时，关联的缓存信息清空
            closeAdd(){
                console.log("=========================>", this.connectInfoListSt)
                console.log("=========================> 关闭新增页面")
                fileURLStore.clear();
                this.connectInfoListSt = [];
                console.log("=========================>",this.connectInfoListSt)
            },

//取消编辑页面按钮
            cancelupdateData() {
                //先清空编辑页面数据，后赋予一条空数据
                this.form.head = [];
                this.form.head.push({
                    productName: '',
                    productContent: ''
                });
                this.editTempData = [];
                this.dialogFormVisible = false;
            },
            loadFileForm(fileValue) {
                this.getRequest("/BOMFile/dataFile/findDfBomFileByPage?page=" + this.currentPage +
                    "&size=" + this.pageSize +
                    "&fileValue=" + fileValue).then(resp => {
                    this.loadingFile = true;
                    if (resp && resp.status == 200) {
                        console.log(resp);
                        this.totalrow = resp.data.totals;
                        this.fileDataTable = resp.data.tableByPage;
                        this.loadingFile = false;
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '文件查询失败！'
                        })
                    }
                })
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                console.log(currentPage);
                this.loadFileForm();
            },
            // 下载文件功能开始
            downLoadFile(index, row) {
                // var dfBomNodeName = this.dfBomArrayElement;
                // console.log(dfBomNodeName);
                // console.log(this.fileName);
                var fileId = row.id;
                var fileName = row.filename;
                console.log(fileId, fileName);
                this.apiDownLoad("/BOMFile/dataFile/downloadDfBomFileByName?fileId=" + fileId + "&fileName=" + fileName).then(
                    resp => {
                        var blob = new Blob([resp], {
                            type: "application/octet-stream"
                        });
                        if (window.navigator.msSaveOrOpenBlob) {
                            //msSaveOrOpenBlob方法返回bool值
                            navigator.msSaveBlob(blob, fileName); //本地保存
                        } else {
                            var link = document.createElement('a'); //a标签下载
                            link.href = window.URL.createObjectURL(blob);
                            link.download = fileName;
                            link.click();
                            window.URL.revokeObjectURL(link.href);
                        }
                    })
            },
            // 下载文件功能结束
            //删除文件功能开始
            deleteFile(index, row) {
                var id = row.id;
                console.log("需要删除的" + row.id);
                if (id <= 4) {
                    this.$message({
                        type: 'error',
                        message: '模板文件不能删除！'
                    });
                } else {
                    this.postRequest("/BOMFile/dataFile/deleteDfBomFile?fileId=" + id).then(resp => {
                        if (resp && resp.status == 200) {
                            this.loadFileForm();
                        } else {
                            this.$message({
                                type: 'faild',
                                message: '文件删除失败！'
                            })
                        }
                    })
                }
                this.$nextTick(()=>{
                    this.fileFlash++;
                })
            },
            //删除文件功能结束

            loadTreeChart() {
                console.log("··················")
                console.log(this.tableData);
                const myChart = echarts.init(document.getElementById(
                    'treeChart'));
                myChart.showLoading();

                var option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove',
                    },
                    series: [{
                        type: 'tree',
                        id: 0,
                        name: 'tree1',
                        data: this.tableData,
                        top: '5%',
                        left: '8%',
                        bottom: '5%',
                        right: '10%',
                        symbolSize: 7,
                        roam: true,
                        symbol: 'rectangle',
                        edgeShape: 'polyline',
                        edgeForkPosition: '35%',
                        initialTreeDepth: 3, //树图初始展开的层级
                        lineStyle: {
                            width: 2,

                        },
                        label: {
                            backgroundColor: '#fff',
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 17
                        },
                        leaves: {
                            label: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left',
                                fontWeight: 'normal',
                            }
                        },
                        emphasis: {
                            focus: 'descendant'
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    }]
                };
                myChart.setOption(option);
                myChart.hideLoading();
            },

            // 清除表单信息
            clearDialog() {
                this.ruleForm = {
                    type: 1,
                    partnerName: "",
                    proportionShares: null
                }
                this.$refs.ruleForm.resetFields();
                this.dialogVisible = false;
            },

            // changeType() {},

            // 递归寻找同级，构造层级表格数据开始
            findSameTable(arr, i, casArr) {
                if (i == casArr.length - 1) {
                    return arr;
                } else {
                    return this.findTable(
                        arr[casArr[i].substr(casArr[i].length - 1,
                            1)].children,
                        (i += 1),
                        casArr
                    );
                }
            },
            // 寻找父级
            findTable(arr, i, casArr) {
                if (i == casArr.length - 1) {
                    let index = casArr[i].substr(casArr[i].length - 1,
                        1);
                    return arr[index];
                } else {
                    return this.findTable(
                        arr[casArr[i].substr(casArr[i].length - 1,
                            1)].children,
                        (i += 1),
                        casArr
                    );
                }
            },
            // 递归表格数据(添加)
            find(arr, i) {
                if (i == this.casArr.length - 1) {
                    return arr[this.casArr[i].substr(this.casArr[i]
                        .length - 1, 1)]
                        .children;
                } else {
                    return this.find(
                        arr[this.casArr[i].substr(this.casArr[i]
                            .length - 1, 1)]
                            .children,
                        (i += 1)
                    );
                }
            },
            // 递归表格数据(编辑)
            findSd(arr, i, casArr) {
                if (i == casArr.length - 1) {
                    let index = casArr[i].substr(casArr[i].length - 1,
                        1);
                    return arr.splice(index, 1, this.temp);
                } else {
                    return this.findSd(
                        arr[casArr[i].substr(casArr[i].length - 1,
                            1)].children,
                        (i += 1),
                        casArr
                    );
                }
            },
            // 递归寻找同步名称
            findLable(arr, i, casArr) {
                if (i == casArr.length - 1) {
                    let index = casArr[i].substr(casArr[i].length - 1,
                        1);
                    return arr[index];
                } else {
                    return this.findLable(
                        arr[casArr[i].substr(casArr[i].length - 1,
                            1)].children,
                        (i += 1),
                        casArr
                    );
                }
            },
            // 同步子名称
            useChildLable(arr) {
                if (arr !== []) {
                    arr.forEach((item) => {
                        item.parent = this.temp.name;
                    });
                }
            },
            // 递归表格数据(删除)
            findDel(arr, i, item) {
                let casArr = item.childKey;
                if (i == casArr.length - 2) {
                    let index = casArr[i].substr(casArr[i].length - 1,
                        1);
                    arr[index].children.forEach((it, ix, arrs) => {
                        if (it == item) {
                            return arrs.splice(ix, 1);
                        }
                    });
                } else {
                    return this.findDel(
                        arr[casArr[i].substr(casArr[i].length - 1,
                            1)].children,
                        (i += 1),
                        item
                    );
                }
            },
            // 置空
            resetTemp() {
                this.temp = {};
                this.form = {
                    head: [{
                        productName: "",
                        productContent: "",
                    }]
                };
                this.fileList = [];
            },
            // 打开添加
            handleCreate() {
                this.resetTemp();
                this.dialogFormVisible = true;
                this.dialogStatus = 'create';
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate();
                });
            },

            // 添加
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        if (this.sonStatus == false) {
                            this.temp.value = String(this.tableData.length);
                            const obj = Object.assign({}, this.temp);
                            obj.children = [];
                            obj.parent = '';
                            this.tableData.push(obj);
                            this.$message({
                                type: 'success',
                                message: '添加成功',
                            });
                            this.saveTopDataJSON();
                        } else {
                            let arr = this.find(this.tableData, 0);
                            if (this.casArr[this.casArr.length - 1].includes('A')) {
                              this.temp.value =
                                String('A' +String(this.casArr[this.casArr.length - 1]).slice(1)) + '-' +
                                String(arr.length);
                            }else if (this.casArr[this.casArr.length - 1].includes('B')) {
                              this.temp.value =
                                String('A' +String(this.casArr[this.casArr.length - 1]).slice(1)) + '-' +
                                String(arr.length);
                            }else if (this.casArr[this.casArr.length - 1].includes('C')) {
                              this.temp.value =
                                String('A' +String(this.casArr[this.casArr.length - 1]).slice(1)) + '-' +
                                String(arr.length);
                            }else {
                              this.temp.value =
                                String('A' + this.casArr[this.casArr.length - 1]) + '-' +
                                String(arr.length);
                            }
                            delete this.temp.children;
                            const obj = Object.assign({}, this.temp);
                            obj.children = [];
                            obj.childKey = [...this.casArr, String(arr.length)];
                            obj.parent = this.findTable(
                                this.tableData,
                                0,
                                this.casArr
                            ).value;
                            if (this.temp.location === '2') {
                                obj.location = String(
                                    [...this.casArr, String(arr.length)].length
                                );
                            }
                            arr.push(obj);
                            this.$message({
                                type: 'success',
                                message: '添加成功',
                            });
                            // this.saveTableDataJSON();直接将之前的数据进行删除然后新增
                            console.log("此时添加的节点信息是");
                            console.log(obj);
                            this.oneBomDataTxt.childKey = JSON.stringify(obj.childKey);
                            this.oneBomDataTxt.name = JSON.stringify(obj.name);
                            this.oneBomDataTxt.parent = JSON.stringify(obj.parent);
                            this.oneBomDataTxt.location = JSON.stringify(obj.location);
                            this.oneBomDataTxt.value = JSON.stringify(obj.value);
                            this.oneBomDataTxt.descript = JSON.stringify(obj.descript);
                            this.oneBomDataTxt.builder = JSON.stringify(obj.builder);
                            this.oneBomDataTxt.editor = JSON.stringify(obj.editor);
                            this.oneBomDataTxt.editorTime = JSON.stringify(obj.editorTime);
                            this.oneBomDataTxt.version = JSON.stringify(obj.version);
                            this.oneBomDataTxt.detail = JSON.stringify(obj.detail);
                            this.oneBomDataTxt.formJson = JSON.stringify(this.form.head);
                            console.log(JSON.stringify(obj.childKey));
                            console.log("属性信息是·················");
                            console.log(this.oneBomDataTxt.formJson);
                            console.log("属性信息是·················");

                            this.saveUpdateDataJSON();
                            console.log("页面还没关闭")
                        }
                    } else {
                        return false;
                    }
                });
            },

            //获取后端EBOM数据
            getTableData() {
                this.$http({
                    method: 'get',
                    url: "/dfbom/data/getTableData",
                    // data: this.tableDataTxt,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    // this.postRequest("/ebom/data/saveTableData?treeDataJson="+tableDataJSON)
                    // this.postJsonRequest("/ebom/data/saveTableData",tableDataJSON).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        // this.probability = resp.data.cutSet.cutSetProbability;
                        // this.probabilityNum = resp.data.cutSet.cutSetProbabilityNum;
                        console.log("后端返回的数据为---------" + this.tableDataRetrun);
                        this.tableData = JSON.parse(this.tableDataRetrun);
                        this.$message({
                            type: 'success',
                            message: '节点信息获取成功！',
                        })
                        this.loadTreeChart();
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },
            //提交顶层数据直接进行保存
            saveTopDataJSON() {
                var tableDataJSON = JSON.stringify(this.tableData);
                this.tableDataTxt.message = tableDataJSON;
                console.log("前端传入的数据为·············" + tableDataJSON);
                this.$http({
                    method: 'post',
                    url: "/dfbom/data/saveTopData",
                    data: this.tableDataTxt,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        console.log("后端返回的数据为---------" + this.tableDataRetrun);
                        // this.tableData = JSON.parse(this.tableDataRetrun);
                        this.getTableDataLate();
                        this.$message({
                            type: 'success',
                            message: '顶节点信息添加成功，且成功存储至数据库！',
                        })
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },

            //直接保存单条数据saveOneData、保存后进行关联关系的发送
            saveUpdateDataJSON() {
                var formJson = JSON.stringify(this.form.head);
                var UpdateJSON = JSON.stringify(this.obj);
                console.log(this.oneBomDataTxt);
                // this.updateOneDataTxt.message = this.obj;
                this.$http({
                    method: 'post',
                    url: "/dfbom/data/saveOneData",
                    data: this.oneBomDataTxt,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        this.conDfBomId = resp.data.connectDfBomId;
                        console.log("后端返回的数据为---------" + this.tableDataRetrun);
                        console.log("存入数据返回的id为---------" + this.conDfBomId);
                        this.getTableDataLate();
                        // 保存关联关系信息
                        if (fileURLStore.getItem("connectInfoList") != null) {
                            this.sentConnectInfo();
                        };
                        this.publishAddNode("dfbom_infomation",this.conDfBomId)
                        this.$message({
                            type: 'success',
                            message: '节点信息添加成功，且成功存储至数据库！',
                        })
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
                this.resetForm('form'); //清除表单数据
                this.dialogFormVisible = false;
            },
            // lwy 发布新增的节点信息
            publishAddNode(tableName,nodeValue){
                if(nodeValue == ''){
                    this.$message({
                        type: 'warning',
                        message: '新增节点的节点id信息为空，无法发布节点，请检查！',
                    })
                }else{
                    this.postRequest("/bomTree/publishAddNode?tableName=" + tableName + "&nodeValue=" + nodeValue).then(resp => {
                        if (resp && resp.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '新增节点信息已经成功发布！',
                            })
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '新增节点发布失败，请检查！',
                            })
                        }
                    });
                }
            },
            //提交数据到后端
            saveTableDataJSON() {
                var tableDataJSON = JSON.stringify(this.tableData);
                this.tableDataTxt.message = tableDataJSON;
                console.log("前端传入的数据为·············" + tableDataJSON);
                this.$http({
                    method: 'post',
                    url: "/dfbom/data/saveTableData",
                    data: this.tableDataTxt,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    // this.postRequest("/ebom/data/saveTableData?treeDataJson="+tableDataJSON)
                    // this.postJsonRequest("/ebom/data/saveTableData",tableDataJSON).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        console.log("后端返回的数据为---------" + this.tableDataRetrun);
                        // this.tableData = JSON.parse(this.tableDataRetrun);
                        this.getTableDataLate();
                        this.$message({
                            type: 'success',
                            message: '节点信息添加成功，且成功存储至数据库！',
                        })
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },
            //获取最新的结构表数据
            async getTableDataLate() {
                await this.$http({
                    method: 'get',
                    url: "/dfbom/data/getTableDataLate",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        console.log("后端返回的最新的数据为---------" + this.tableDataRetrun);
                        this.tableData = JSON.parse(this.tableDataRetrun);
                        this.$message({
                            type: 'success',
                            message: '节点信息获取成功！',
                        })
                        this.loadTreeChart();
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },

            //获取所有层级的数据//测试方法,未使用
            choiceData() {
                let data = [];
                let datas = this.tableData; // 此处的datas为上述数据源
                datas.children.forEach((e, i) => { // 一级
                    if (e.children[i].isselect == false) {
                        data = data.concat(e.children);
                    } else {
                        e.children.forEach((item, j) => { // 二级
                            if (item.children[j]
                                .isselect == false) {
                                data = data.concat(item
                                    .children);
                            }
                        })
                    }
                })
                console.log(data);
                return data;
            },

            // 打开更新textMap
            handleUpdate(index, row) {
                this.form = {
                    head: [{
                        productName: "",
                        productContent: "",
                    }]
                };
                console.log(row);
                row.value.length != 1 ?
                    (this.sonStatus = true) :
                    (this.sonStatus = false);
                this.temp = Object.assign({}, row); // copy obj
                if (row.childKey) {
                    this.childKey = row.childKey;
                    this.idx = row.childKey[row.childKey.length - 1];
                } else {
                    this.idx = row.value;
                }
                console.log(this.idx);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate();
                });
                //将属性信息显示到可增添删减的属性编辑栏内
                var NameListindex = 0;
                var productNameList = new Array();
                var ContentListindex = 0;
                var productContentList = new Array();
                //把节点1 3 5 7等成为form中标题显示，偶数变为具体字段名称

                if (row.propOne !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propOne;
                    NameListindex++;
                }
                ;
                if (row.propThree != (null || undefined || "")) {
                    productNameList[NameListindex] = row.propThree;
                    NameListindex++;
                }
                ;
                if (row.propFive !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propFive;
                    NameListindex++;
                }
                ;
                if (row.propSeven !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propSeven;
                    NameListindex++;
                }
                ;
                if (row.propNine !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propNine;
                    NameListindex++;
                }
                ;
                if (row.propEleven !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propEleven;
                    NameListindex++;
                }
                ;
                if (row.propThirteen !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propThirteen;
                    NameListindex++;
                }
                ;
                if (row.propFifteen !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propFifteen;
                    NameListindex++;
                }
                ;
                if (row.propSeventeen !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propSeventeen;
                    NameListindex++;
                }
                ;
                if (row.propNineteen !== (null || undefined || "")) {
                    productNameList[NameListindex] = row.propNineteen;
                    NameListindex++;
                }
                ;
                //具体属性数值
                if (row.propThree !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propTwo;
                    ContentListindex++;
                }
                ;
                if (row.propFour !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propFour;
                    ContentListindex++;
                }
                ;
                if (row.propSix !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propSix;
                    ContentListindex++;
                }
                ;
                if (row.propEight !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propEight;
                    ContentListindex++;
                }
                ;
                if (row.propTen !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propTen;
                    ContentListindex++;
                }
                ;
                if (row.propTwelve !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propTwelve;
                    ContentListindex++;
                }
                ;
                if (row.propFourteen !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propFourteen;
                    ContentListindex++;
                }
                ;
                if (row.propSixteen !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propSixteen;
                    ContentListindex++;
                }
                ;
                if (row.propEighteen !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propEighteen;
                    ContentListindex++;
                }
                ;
                if (row.propTwenty !== (null || undefined || "")) {
                    productContentList[ContentListindex] = row.propTwenty;
                    ContentListindex++;
                }
                ;
                for (var i = 0; i < 10; i++) {
                    if (productNameList[i] === null || productNameList[i] === undefined) {
                        break;
                    }

                    //vue能够监听的对象为Observer 普通的Object不能实时变化
                    if (i == 0) {
                        this.form.head[i].productName = productNameList[i];
                        this.form.head[i].productContent = productContentList[i];
                    } else {
                        this.form.head.push({
                            productName: productNameList[i],
                            productContent: productContentList[i]
                        });
                    }
                }

                if (this.form.head.length != 1) {
                    //新增一条空数据
                    this.form.head.push({
                        productName: '',
                        productContent: ''
                    });
                }
                // console.log("productNameList-------------------->");
                // console.log(row.propThree);
                // console.log(productNameList);
                // console.log(this.form);
                //获取关联节点
                // this.getConnectInfo();
                this.getRequest("/dfbom/data/selectConnectInfo?selectId=" + row.value).then(resp => {
                    if (resp && resp.status == 200) {
                        console.log(resp);
                        this.connectInfoTable = resp.data.connectInfos;
                        this.$message({
                            type: 'success',
                            message: '您选择的节点下的关联信息获取成功！',
                        })
                    }
                });

                console.log(row.value);
                this.loadFileForm(row.value);
            },

            //点击查看数据
            handleLookTree(index, row) {
                this.dialogStatus = 'look';
                console.log(row);
                row.value.length != 1 ?
                    (this.sonStatus = true) :
                    (this.sonStatus = false);
                this.temp = Object.assign({}, row); // copy obj
                if (row.childKey) {
                    this.childKey = row.childKey;
                    this.idx = row.childKey[row.childKey.length - 1];
                } else {
                    this.idx = row.value;
                }
                console.log(this.idx);

                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate();
                });
                // this.getConnectInfo();
                console.log(row.value)
                this.getRequest("/dfbom/data/selectConnectInfo?selectId=" + row.value).then(resp => {
                    if (resp && resp.status == 200) {
                        console.log(resp);
                        this.connectInfoTable = resp.data.connectInfos;
                        this.$message({
                            type: 'success',
                            message: '您选择的节点下的关联信息获取成功！',
                        })
                    }
                });
                this.dialogFormVisible = true;
                console.log(row.value);
                this.loadFileForm(row.value);
            },
            // 更新
            updateData(row) {
                console.log("更新方法获取的数据");
                console.log(row);
                row.value.length != 1 ?
                    (this.sonStatus = true) :
                    (this.sonStatus = false);
                this.temp = Object.assign({}, row); // copy obj
                if (row.childKey) {
                    this.childKey = row.childKey;
                    this.idx = row.childKey[row.childKey.length - 1];
                } else {
                    this.idx = row.value;
                }
                console.log(this.idx);

                // this.dialogTreeVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate();
                });
                if (this.dialogStatus == 'update') {
                    // 具体更改数据方法

                    if (row.children.length != 0) {
                        delete row.children;
                        console.log("删除children子集，只拿到自己本身")
                    }
                    this.editTempData = row;
                    console.log("数据情况");
                    console.log(this.editTempData);
                    //发送对象，必须用JSON格式发送

                    if (typeof this.form.head[0] !== 'undefined') {
                        this.editTempData.propOne = this.form.head[0].productName;
                        this.editTempData.propTwo = this.form.head[0].productContent;
                    } else {
                        this.editTempData.propOne = null;
                        this.editTempData.propTwo = null;
                    }
                    ;
                    if (typeof this.form.head[1] !== 'undefined') {
                        this.editTempData.propThree = this.form.head[1].productName;
                        this.editTempData.propFour = this.form.head[1].productContent;
                    } else {
                        this.editTempData.propThree = null;
                        this.editTempData.propFour = null;
                    }
                    ;
                    if (typeof this.form.head[2] !== 'undefined') {
                        this.editTempData.propFive = this.form.head[2].productName;
                        this.editTempData.propSix = this.form.head[2].productContent;
                    } else {
                        this.editTempData.propFive = null;
                        this.editTempData.propSix = null
                    }
                    ;
                    if (typeof this.form.head[3] !== 'undefined') {
                        this.editTempData.propSeven = this.form.head[3].productName;
                        this.editTempData.propEight = this.form.head[3].productContent;
                    } else {
                        this.editTempData.propSeven = null;
                        this.editTempData.propEight = null;
                    }
                    ;
                    if (typeof this.form.head[4] !== 'undefined') {
                        this.editTempData.propNine = this.form.head[4].productName;
                        this.editTempData.propTen = this.form.head[4].productContent;
                    } else {
                        this.editTempData.propNine = null;
                        this.editTempData.propTen = null;
                    }
                    ;
                    if (typeof this.form.head[5] !== 'undefined') {
                        this.editTempData.propEleven = this.form.head[5].productName;
                        this.editTempData.propTwelve = this.form.head[5].productContent;
                    } else {
                        this.editTempData.propEleven = null;
                        this.editTempData.propTwelve = null;
                    }
                    ;
                    if (typeof this.form.head[6] !== 'undefined') {
                        this.editTempData.propThirteen = this.form.head[6].productName;
                        this.editTempData.propFourteen = this.form.head[6].productContent;
                    } else {
                        this.editTempData.propThirteen = null;
                        this.editTempData.propFourteen = null
                    }
                    ;
                    if (typeof this.form.head[7] !== 'undefined') {
                        this.editTempData.propFifteen = this.form.head[7].productName;
                        this.editTempData.propSixteen = this.form.head[7].productContent;
                    } else {
                        this.editTempData.propFifteen = null
                        this.editTempData.propSixteen = null;
                    }
                    ;
                    if (typeof this.form.head[8] !== 'undefined') {
                        this.editTempData.propSeventeen = this.form.head[8].productName;
                        this.editTempData.propEighteen = this.form.head[8].productContent;
                    } else {
                        this.editTempData.propSeventeen = null;
                        this.editTempData.propEighteen = null;
                    }
                    ;
                    if (typeof this.form.head[9] !== 'undefined') {
                        this.editTempData.propNineteen = this.form.head[9].productName;
                        this.editTempData.propTwenty = this.form.head[9].productContent;
                    } else {
                        this.editTempData.propNineteen = null;
                        this.editTempData.propTwenty = null;
                    }
                    ;

                    //
                    // this.form.head[i].productName = productNameList[i];
                    // this.form.head[i].productContent = productContentList[i];
                    // productNameList[0] = row.propSeven;


                    console.log("数据情况");
                    console.log(this.editTempData);

                    this.$http({
                        method: 'post',
                        url: "/bomTree/editBomTreeData",
                        data: this.editTempData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(resp => {
                        if (resp.data == 1 && resp.status == 200) {
                            this.dialogFormVisible = false;
                            this.$message.success("产品数据变更成功");
                            this.getTableDataLate();
                            //更改后再发送一次变更请求，并显示更改成功
                            //因为下述方法的内编码是row.intracoding的赋值,因此赋值到this.showdateform
                            //this.sendrequestChange(this.editTempData);
                            this.editTempData = [];
                            //先清空编辑页面数据，后赋予一条空数据
                            this.form.head = [];
                            this.form.head.push({
                                productName: '',
                                productContent: ''
                            });
                        } else {
                            this.$message.error("产品数据变更失败");
                            this.getTableDataLate();
                            this.editTempData = [];
                            //先清空编辑页面数据，后赋予一条空数据
                            this.form.head = [];
                            this.form.head.push({
                                productName: '',
                                productContent: ''
                            });
                        }
                    })
                }
            },
            // 删除父级节点
            deleteParent(item) {
                this.tableData.forEach((it, ix, arrs) => {
                    if (it == item) {
                        return arrs.splice(ix, 1);
                    }
                });
                this.loadTreeChart();
            },
            // 删除
            deleteClick(item) {
                this.$confirm(`此操作将删除该标签, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        if (item.children.length != 0) {
                            this.$message.warning({
                                message: '请删除子节点',
                                duration: 1000,
                            });
                        } else {
                            ++this.isResouceShow;
                            if (item.value.length == 1) {
                                this.deleteParent(item);
                                this.loadTreeChart();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功',
                                });
                            } else {
                                this.findDel(this.tableData, 0, item);
                                this.loadTreeChart();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功',
                                });
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            },
            // 是否显示次位置
            locationChange(v) {
                if (v == 2) {
                    this.sonStatus = true;
                } else {
                    this.sonStatus = false;
                }
            },
            // 获取次位置
            getCasVal(v) {
                this.casArr = v;
            },
            //增加属性值
            add_head() {
                this.form.head.push({
                    keys: "",
                    val: ""
                });
            },
            //删除第一个属性
            del_head(index) {
                if(index !== 0){
                        this.form.head.splice(index, 1)
                }

            },

            //重置表单,重置一组或重置数组
            resetForm(formName) {
                this.$refs[formName].resetFields(); //删除所有的表单输入框内容
            },

            //上传数据文件功能开始
            openUploadWindow(index, row) {
                console.log("上传功能");
                // this.dialogVisitFile = true;
            },
            handleCloseFile(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            handleRemove(file, fileList) {
                this.filelist = fileList
                console.log(file, fileList);
            },
            //file,fileList是文件上传组件自带的两个参数
            handleChange(file, fileList) {
                let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
                if (existFile) {
                    this.$message.error('当前文件已经存在!');
                    fileList.pop();
                }
                this.fileList = fileList;
                console.log(fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制最多选择 2 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUpload(file) {
                var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
                var extension1 = testmsg === 'xls';
                var extension2 = testmsg === 'xlsx';
                var extension3 = testmsg === 'doc';
                var extension4 = testmsg === 'docx';
                var extension5 = testmsg === 'dwg';
                var extension6 = testmsg === 'rar';
                var extension7 = testmsg === 'zip';
                var extension8 = testmsg === 'txt';
                var size = file.size / 1024 / 1024;
                if (!extension1 && !extension2 && !extension3 && !extension4 &&
                    !extension5 && !extension6 && !extension7 && !extension8) {
                    this.$message({
                        message: '上传文件只能是xls、xlsx、doc、docx、dwg、rar、zip、txt格式!',
                        type: 'danger'
                    });
                }
                if (size > 20) {
                    this.$message({
                        type: 'warning',
                        message: `文件大小不得超过20M!`
                    });
                }
                if(size == 0){
                    this.$message({
                        type: 'warning',
                        message: `文件大小不得为0!`
                    });
                }
                return extension1 || extension2
            },
            uploadFile(row) {
                this.logining2 = true;
                var dfbomNodeValue = row.value;
                var dfbomNodeName = row.name;
                console.log(dfbomNodeValue, dfbomNodeName);
                // this.apiDownLoad("/BOMFile/dataFile/downloadBomFile?fileId=" + fileId + "&fileName=" +
                var uploadForm = new FormData();
                for (var i = 0; i < this.fileList.length; i++) {
                    uploadForm.append("file", this.fileList[i].raw);
                }
                uploadForm.append("dfbomNodeId", dfbomNodeValue);
                uploadForm.append("dfbomNodeName", dfbomNodeName);
                console.log("bominfomation" + uploadForm);
                console.log(this.uploadForm);
                this.uploadFileRequest("/BOMFile/dataFile/uploadDfBomFile", uploadForm).then(resp => {
                    this.fileList = [];
                    if (resp && resp.status == 200 && resp.data.Msg == '数据文件上传成功') {
                        console.log(resp);
                        this.fileURLList = resp.data.fileURLList;
                        console.log("文件上传后返回的文件路径：" + this.fileURLList);
                        // 返回的文件路径存入session中作为全局变量,在需要的地方引入,避免刷新后丢失.通过sessionStorage.//封装好的js文件中，以键值对的形式存取数据,也可以通过本地localStorage存储在本地
                        fileURLStore.setItem("dataProcessState", this.fileURLList);
                        console.log("全局变量：" + fileURLStore.getItem("dataProcessState"));
                        this.$message({
                            type: 'success',
                            message: resp.data.Msg
                        });
                        this.dialogVisible = false;
                        this.logining2 = false;
                        this.loadFileForm(dfbomNodeValue);
                        // this.findAllFile();
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '文件上传失败！,请检查文件是否为空'
                        })
                        this.logining2 = false;
                    }
                });
            },
            upLoadSucceed(resp, file, fileList) {
                this.loadForm();
                console.log("文件上传成功钩子：" + resp, file, fileList);
            },
            // 文件上传失败时的钩子
            upLoadError(err, file, fileList) {
                this.$message({
                    type: 'danger',
                    message: `文件上传失败!`
                });
            },
            // 上传数据文件功能结束

            //处理关联节点开始
            handleConnectNode() {
                this.temp.children2 = ''
                this.connectRelationSelect = ''
                this.dfBomInfo = [];
                this.visitDfBOM = true;
                this.getDfBOMDataLate();
            },

            //处理关联节点开始
            handleConnectNodeOut() {
                this.temp.children3 = ''
                this.connectRelationSelect = '' //关联信息删除
                this.outBomInfo = []              //属性信息删除
                this.visitOutBOM = true;
                this.getOutBOMDataLate();
            },

            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },

            //获取DfBOM的数据
            getDfBOMDataLate() {
                this.$http({
                    method: 'get',
                    url: "/dfbom/data/getTableDataLate",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        // console.log("后端返回的最新的数据为---------" + this.tableDataRetrun);
                        this.tableDfBomData = JSON.parse(this.tableDataRetrun);
                        this.$message({
                            type: 'success',
                            message: '节点信息获取成功！',
                        })
                        // this.loadTreeChart();
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },

            getOutBOMDataLate() {
                this.$http({
                    method: 'get',
                    url: "/outbom/data/getTableDataLate",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.message;
                        // console.log("后端返回的最新的数据为---------" + this.tableDataRetrun);
                        this.tableOutBomData = JSON.parse(this.tableDataRetrun);
                        this.$message({
                            type: 'success',
                            message: '节点信息获取成功！',
                        })
                        // this.loadTreeChart();
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '出错，请检查程序！'
                        })
                    }
                });
            },

            //获取所选中的DfBOM节点的label
            handleMallCatergoryChange() {
                if (this.temp.children2.length != 0) {
                    let arr = this.$refs['cascaderMallCatergory'].getCheckedNodes()[0].pathLabels;
                    let arrValue = this.$refs['cascaderMallCatergory'].value;
                    console.log('arr', arr);
                    console.log('arrValue', arrValue);
                    var connectRela = this.$refs.mySelected.value;
                    this.dfBomArrayElementValue = arrValue[arrValue.length - 1];
                    this.dfBomArrayElement = arr[arr.length - 1]; //获取数组最后一个元素
                    // this.connectInfoList[index].
                    this.getRequest("/dfbom/data/getOneNodeInfo?dfBomArrayElement=" + this.dfBomArrayElement).then(
                        resp => {
                            if (resp && resp.status == 200) {
                                console.log(resp);
                                this.dfBomArray = resp.data.oneNodeInfo;
                                this.dfBomInfo = this.dfBomArray[0];
                                if (this.dfBomArray[0].propOne != null) {
                                    this.$message({
                                        type: 'success',
                                        message: '您选择的节点下的属性信息获取成功！',
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '该节点下暂时没有属性信息，若需添加属性信息请前往对应的BOM节点下新增属性，谢谢！',
                                    })
                                }
                            }
                        });

                }

            },
            connectDfBom(){
                if(this.$refs['cascaderMallCatergory'].getCheckedNodes()[0] == null){
                    this.$message({
                        message: '请选择关联节点',
                        type: 'warning'
                    });
                    return;
                }
                //
                let arr = this.$refs['cascaderMallCatergory'].getCheckedNodes()[0].pathLabels;
                //
                let arrValue = this.$refs['cascaderMallCatergory'].value;
                var connectRela = this.$refs.mySelected.value;
                if(connectRela == null || connectRela == ""){
                    this.$message({
                        message: '请选择关联关系',
                        type: 'warning'
                    });
                    return;
                }
                this.dfBomArrayElementValue = arrValue[arrValue.length - 1];
                this.dfBomArrayElement = arr[arr.length - 1]; //获取数组最后一个元素
                this.connectInfoList.push({
                    connectNodeName: arr + '',
                    connectNodeValue: this.dfBomArrayElementValue,
                    connectRela: connectRela
                });
                fileURLStore.setItem("connectInfoList", this.connectInfoList);
                this.visitDfBOM = false;
            },
            //获取所选中的外部应用数据节点的label
            handleMallCatergoryChangeOut() {
                if (this.temp.children3.length != 0) {
                    let arr = this.$refs['cascaderMallCatergoryOut'].getCheckedNodes()[0].pathLabels;
                    let arrValue = this.$refs['cascaderMallCatergoryOut'].value;
                    console.log('arr', arr);
                    console.log('arrValue', arrValue);
                    this.dfBomArrayElementValue = arrValue[arrValue.length - 1];
                    this.dfBomArrayElement = arr[arr.length - 1]; //获取数组最后一个元素
                    this.getRequest("/outbom/data/getOneNodeInfo3?stBomArrayElement=" + this.dfBomArrayElement).then(
                        resp => {
                            if (resp && resp.status == 200) {
                                console.log(resp);
                                this.outBomArray = resp.data.oneNodeInfo;
                                this.outBomInfo = this.outBomArray[0];
                                if (this.outBomArray[0].propOne != null) {
                                    this.$message({
                                        type: 'success',
                                        message: '您选择的节点下的属性信息获取成功！',
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '该节点下暂时没有属性信息，若需添加属性信息请前往对应的BOM节点下新增属性，谢谢！',
                                    })
                                }
                            }
                        });
                }
            },
            connectOutBom(){
                if(this.$refs['cascaderMallCatergoryOut'].getCheckedNodes()[0] == null){
                    this.$message({
                        message: '请选择关联节点',
                        type: 'warning'
                    });
                    return;
                }
                let arr = this.$refs['cascaderMallCatergoryOut'].getCheckedNodes()[0].pathLabels;
                let arrValue = this.$refs['cascaderMallCatergoryOut'].value;
                var connectRela = this.$refs.mySelectedOut.value;
                if(connectRela == null || connectRela == ""){
                    this.$message({
                        message: '请选择关联关系',
                        type: 'warning'
                    });
                    return;
                }else{
                    this.dfBomArrayElementValue = arrValue[arrValue.length - 1];
                    this.dfBomArrayElement = arr[arr.length - 1]; //获取数组最后一个元素
                    this.connectInfoList.push({
                        connectNodeName: arr + '',
                        connectNodeValue: this.dfBomArrayElementValue,
                        connectRela: connectRela
                    });
                    fileURLStore.setItem("connectInfoList", this.connectInfoList);
                    console.log("全局变量：" , fileURLStore.getItem("connectInfoList"));
                }
                this.visitOutBOM = false;
            },
            resetNodeProp() {
                this.dfBomInfo = {};
                this.$refs['cascaderMallCatergory'].getCheckedNodes()[0] = [];
                this.$refs['cascaderMallCatergory'].value = [];
                this.dfBomArrayElement = []; //获取数组最后一个元素
                this.dfBomArrayElementValue = [];

            },

            findFileByName() {
                if (this.dfBomArrayElement == '' || this.dfBomArrayElement == null) {
                    console.log("选择的节点名称为空" + this.dfBomArrayElement);
                    this.$message({
                        type: 'warning',
                        message: '请输入文件名作为查询条件！'
                    })
                } else {
                    console.log("选择的节点名称" + this.dfBomArrayElement);
                    this.loadForm();
                }
            },

            sentConnectInfo() {
                this.visitDfBOM = false;
                console.log("全局变量：" + fileURLStore.getItem("connectInfoList"));
                console.log(fileURLStore.getItem("connectInfoList"));
                // var connectInfoListDf = fileURLStore.getItem("connectInfoList");
                // connectInfoListDf.add("conDfBomId",this.conDfBomId) ;
                // console.log(connectInfoListDf);
                this.connectDfInfoText.connectInfoListText = JSON.stringify(fileURLStore.getItem("connectInfoList"))
                    .toString();
                console.log("关联关系信息是");
                console.log(this.connectDfInfoText.connectInfoListText);
                this.connectDfInfoText.connectInfoId = JSON.stringify(this.conDfBomId).toString();

                this.$http({
                    method: 'post',
                    url: "/dfbom/data/saveDfConnectData",
                    data: this.connectDfInfoText,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }).then(resp => {
                    fileURLStore.clear();
                    this.connectInfoListSt = [];
                    if (resp && resp.status == 200) {
                        this.tableDataRetrun = resp.data.connectInfoListDf;
                        console.log("后端返回的数据为---------" + this.tableDataRetrun);
                        // this.getTableDataLate();
                        this.$message({
                            type: 'success',
                            message: resp.data.Msg,
                        })
                    } else {
                        this.$message({
                            type: 'faild',
                            message: '保存关联信息出错，请检查程序！'
                        })
                    }
                });
                // this.connectInfoList = ;
                // console.log("关联关系是：" + this.connectInfoList);
                // // 返回的文件路径存入session中作为全局变量,在需要的地方引入,避免刷新后丢失.通过sessionStorage.//封装好的js文件中，以键值对的形式存取数据,也可以通过本地localStorage存储在本地
                // fileURLStore.setItem("dataProcessState", this.fileURLList);
                // console.log("全局变量：" + fileURLStore.getItem("dataProcessState"));
            },


            /*
                变更影响性分析代码
                */
            //发送变更请求
            sendrequestChange(row) {
                //发送变更请求（通过内编码）
                var submitintracoding = row.value;
                var tablename = 'dfbom_infomation';
                var Associationtablename = 'dfbom_connect_info';
                this.getRequest("/bomTree/sendrequesteditBomTreeData?submitintracoding=" + submitintracoding +
                    "&tablename=" + tablename + "&Associationtablename=" + Associationtablename)
                    .then(resp => {
                        if (resp.data.updatanum > 0 && resp.status == 200) {
                            this.$message.success("发送变更请求成功");
                            this.getTableDataLate();
                            if (resp.data.OtherBomTips.BBOM.length!=0||resp.data.OtherBomTips.DBOM.length!=0||resp.data.OtherBomTips.DfBOM.length!=0
                                ||resp.data.OtherBomTips.EBOM.length!=0||resp.data.OtherBomTips.MBOM.length!=0||resp.data.OtherBomTips.OBOM.length!=0
                                ||resp.data.OtherBomTips.SBOM.length!=0||resp.data.OtherBomTips.StBOM.length!=0){
                                //变更弹窗显示方法
                                console.log("resp.data.OtherBomTips")
                                console.log(resp.data)
                                this.OtherBomTipsFunction(resp.data);}
                        } else {
                            this.$message.error("发送变更请求失败");
                            this.getTableDataLate();
                        }
                    })
            },

            //确认完成所有更改请求方法
            submitChange() {
                var tablename = 'dfbom_infomation';
                //将可编辑状态都改成不可编辑
                this.getRequest("/bomTree/endeditBomTreeData?tablename=" + tablename)
                    .then(resp => {
                        if (resp.data == 1 && resp.status == 200) {
                            this.$message.success("结束变更操作成功");
                            this.getTableDataLate();
                        } else {
                            this.$message.warning("结束变更操作失败");
                            this.getTableDataLate();
                        }
                    })
            },

            //删除节点方法
            deleltedata(row) {
                this.$confirm(`此操作将删除该标签及全部子集, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        //发送变更请求（通过内编码）
                        var tablename = 'dfbom_infomation';
                        var submitintracoding = row.value;
                        this.getRequest("/bomTree/deleteBomTreeData?intracoding=" + submitintracoding + "&tablename=" +
                            tablename)
                            .then(resp => {
                                if (resp.data.deleteNum > 0 && resp.data.updateintracoding > 0 && resp.status ==
                                    200) {
                                    this.$message.success("删除节点成功");
                                    this.getTableDataLate();
                                } else if (resp.data.deleteNum > 0 && resp.data.updateintracoding == 0 && resp
                                    .status == 200) {
                                    this.$message.success("删除节点成功");
                                    this.getTableDataLate();
                                } else {
                                    this.$message.warning("删除节点失败");
                                    this.getTableDataLate();
                                }
                            })
                        this.dialogFormVisible = false
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        });
                    });
            },
            //删除关联关系
            associationDelete(row) {
                var submitNodeintracoding = row.connectNodeValue;
                var submitintracoding = row.connectId;
                var tablename = 'stbom_connect_info';
                this.getRequest("/bomTree/associationDelete?submitNodeintracoding=" + submitNodeintracoding + "&submitintracoding=" + submitintracoding + "&tablename=" + tablename)
                    .then(resp => {
                        if (resp.data.deleteNum > 0 && resp.status == 200) {
                            this.$message.success("删除关联关系成功");
                            //更新关联关系表
                            this.connectInfoTable = [];
                            this.getRequest("/stbom/data/selectConnectInfo?selectId=" + row.connectId).then(resp => {
                                if (resp && resp.status == 200) {
                                    console.log(resp);
                                    this.connectInfoTable = resp.data.connectInfos;
                                    this.$message({
                                        type: 'success',
                                        message: '您选择的节点下的关联信息获取成功！',
                                    })
                                }
                            });
                            this.getTableDataLate();
                        } else {
                            this.$message.error("删除关联关系失败");
                            //更新关联关系表
                            this.connectInfoTable = [];
                            this.getRequest("/stbom/data/selectConnectInfo?selectId=" + row.connectId).then(resp => {
                                if (resp && resp.status == 200) {
                                    console.log(resp);
                                    this.connectInfoTable = resp.data.connectInfos;
                                    this.$message({
                                        type: 'success',
                                        message: '您选择的节点下的关联信息获取成功！',
                                    })
                                }
                            });
                            this.getTableDataLate();
                        }
                    })
            },
            //其他BOM关联关系显示方法
            OtherBomTipsFunction(data) {
                //获取各个BOM数据
                this.OtherBomTipsdata = data.OtherBomTips;
                this.DBOM = this.OtherBomTipsdata.DBOM;
                this.DfBOM = this.OtherBomTipsdata.DfBOM;
                this.EBOM = this.OtherBomTipsdata.EBOM;
                this.MBOM = this.OtherBomTipsdata.MBOM;
                this.OBOM = this.OtherBomTipsdata.OBOM;
                this.SBOM = this.OtherBomTipsdata.SBOM;
                this.StBOM = this.OtherBomTipsdata.StBOM;
                this.BBOM = this.OtherBomTipsdata.BBOM;
                this.dialogTableVisibleOtherBomTips = true;
            },
            dialogTableVisibleOtherBomTipsClose(){
                this.OtherBomTipsdata = [];
                this.DBOM = [];
                this.DfBOM =[];
                this.EBOM = [];
                this.MBOM = [];
                this.OBOM = [];
                this.SBOM = [];
                this.StBOM =[];
                this.dialogTableVisibleOtherBomTips = false;
            }

        },



    }
</script>
<style>
  /* .tree-contanier .TreeChart {
    display: inline;
  } */
  #container {
    width: 980px;
    margin: 0 auto;
    height: auto;
    /* background-color: #ccc; */
    overflow-x: scroll;
    /* overflow: scroll; */
  }

  .show-section {
    margin: 10px;
    border-radius: 4px;
  }

  /* //增加让scope中的按钮变成一行的样式 */
  .inline-block {
    display: inline-block;
  }

  .elcascader {
    width: 60%;
    border-color: #de6f6f;
  }
  /*xjw  el-dialog高度自适应，内容超出时中间出现滚动条 */
  .el-dialog{
    overflow: hidden; /*高度自适应*/
    padding-bottom: 15px;
    /*height: fit-content;*/
  }

</style>
