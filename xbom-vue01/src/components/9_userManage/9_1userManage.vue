<template>
	<div>
	  <div style="width: 100%;margin-top: 20px;">
	  	<div style="color: #124880;margin: auto 0;margin-bottom: 10px;">
	  		<h2>|&emsp;用户查询</h2>
	  	</div>

     <!--<el-input placeholder="根据用户姓名查找" v-model="input" size="small" class="input-with-select">
			  <el-button slot="append" icon="el-icon-search" @click="onSearch()" ></el-button>
			</el-input> -->
    <!-- //查询输入框开始 -->
    <div class="demo-input-suffix" style="margin-top: 0px;display: flex;flex-direction: row">
    	<div style="width:33%;margin-left: 10px; ">
    		<el-input placeholder="请输入用户名" v-model="selectForm.userName" size="small" >
    			<template slot="prepend">用户名</template>
    		</el-input>
    	</div>

    	<div style="width:33%;margin-left: 10px; ">
    		<el-input placeholder="请输入ID" v-model="selectForm.userAccount" size="small" >
    			<template slot="prepend">用户账号</template>
    		</el-input>
    	</div>

    	<div style="width:33%;margin-left: 10px; ">
    		<el-input placeholder="请输入手机号" v-model="selectForm.userNum" size="small" >
    			<template slot="prepend">电话号码</template>
    		</el-input>
    	</div>

    	<div style="width:35%;margin-left: 10px; ">
    		<el-button size="small" type="primary"  @click="onSearch()">查询</el-button>
    		<el-button size="small" type="primary"  @click="resetForm()">重置</el-button>
    	</div>
    </div>
    <!-- //查询输入框结束 -->
	  </div>
    <!-- 在用户管理页面进行用户注册新增 -->
    <div>
    <el-dialog
      title="添加用户"
      :visible.sync="showAdddialog"
      width="30%"
      :before-close="handleClose">

      <div style="right: 2rem;top: 3rem;">
      	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading">
      	<div style="width: 20rem;">
      		<el-input placeholder="账号" type="text" prefix-icon="el-icon-user" v-model="ruleForm.regAccount"></el-input>
      	</div>
      	<div style="width: 20rem;margin-top: 1rem;">
      		<el-input placeholder="真实姓名" type="text" prefix-icon="el-icon-place" v-model="ruleForm.regName"></el-input>
      	</div>
      	<div style="width: 20rem;margin-top: 1rem;">
      		<el-form-item prop="regNumber">
      			<el-input placeholder="电话号码" type="text" prefix-icon="el-icon-phone-outline" v-model="ruleForm.regNumber"></el-input>
      		</el-form-item>
      	</div>
      	<div style="width: 20rem;margin-top: 1rem;">
      		<el-input placeholder="密码" type="password" prefix-icon="el-icon-c-scale-to-original" v-model="ruleForm.regPass"></el-input>
      	</div>
      	<div style="width: 20rem;margin-top: 1rem;">
      		<el-form-item prop="checkRegPass">
      			<el-input placeholder="确认密码" type="password" prefix-icon="el-icon-c-scale-to-original" v-model="ruleForm.checkRegPass"></el-input>
      		</el-form-item>
      	</div>
      	<div style="width: 20rem;margin-top: 1rem;display: flex;justify-content:space-between">
          <!-- &emsp; -->
          <span style="margin-left: 30px; margin-top: 0px;display: flex;">用户角色:</span>
      		<span>
          <el-radio v-model="radio" label="2">管理员</el-radio>
      		<el-radio v-model="radio" label="3">普通用户</el-radio>
          </span>
      	</div>
        <!-- <div style="width: 20rem;margin-top: 1rem;">
          <el-select v-model="ruleForm.value" placeholder="用户角色" prefix-icon="el-icon-trophy">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
      	<div style="margin-left: 5rem; width: 15rem;margin-top: 1rem;">
<!--      		<el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>-->
      		<el-button @click="resetForm2('ruleForm')" >重置</el-button>
          <el-button @click="showAdddialog = false"style="float: right;">取 消</el-button>
      	</div>
      	</el-form>
      </div>
    </el-dialog>
    </div>
    <!-- 在用户管理页面进行用户注册新增 -->
    <!-- 用户显示 -->
	  <div style="width: 100%;margin-top: 0px;">
	  	<div style="float: left;color: #124880;margin: auto 0;margin-bottom: 10px;">
	  		<h2>|&emsp;用户显示</h2>
	  	</div>
		<div v-loading="loading">
			<div style="margin-top: 30px;">
				<el-table
					:data="tableData"
					border
					style="width: 100%">
					<el-table-column
						prop="username"
						label="用户账号"
            sortable
						width="250"
            align="center">
					</el-table-column>
					<el-table-column
						prop="name"
						label="姓名"
						width="250"
            align="center">
					</el-table-column>
					<el-table-column
						prop="phonenumber"
						label="电话号码"
						width="250"
            align="center">
					</el-table-column>
				    <el-table-column
						prop="rolenamezh"
						label="用户权限"
            width="150"
            align="center">
				    </el-table-column>
				    <el-table-column
						prop="intepart"
						label="用户角色"
            width="170"
            align="center">
				    </el-table-column>
					<el-table-column
						prop="enabled"
						label="账户是否可用"
						:formatter="formatBoolean"
						:show-overflow-tooltip="true"
            width="170"
            align="center">
					</el-table-column>
					<el-table-column
					fixed="right"
					label="操作"
					width="200"
          align="center">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small">编辑</el-button>
							<el-button @click="handleDelete(scope.$index, scope.row)" type="danger" size="small">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
      <!-- 用户编辑 -->
			</div>
			<el-dialog title="用户信息" :visible.sync="dialogFormVisible">
			  <el-form :model="form" label-width="80px" size="mini">
			      <el-form-item label="姓名:" :label-width="formLabelWidth">
			        <el-input v-model="form.name" autocomplete="off" disabled></el-input>
			      </el-form-item>
			      <el-form-item label="账号:" :label-width="formLabelWidth">
			        <el-input v-model="form.username" autocomplete="off" disabled></el-input>
			      </el-form-item>
				  <el-form-item label="电话号码:" :label-width="formLabelWidth">
				    <el-input v-model="form.phonenumber" autocomplete="off" ></el-input>
				  </el-form-item>
				  <el-form-item label="系统使用权限:" :label-width="formLabelWidth">
					  <el-switch
					    style="display: block"
					    v-model="form.enabled"
					    active-color="#124880"
					    inactive-color="#505458"
					    active-text="打开权限"
					    inactive-text="关闭权限">
					  </el-switch>
				  </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="update()">修改</el-button>
			  </div>
			</el-dialog>
			<div style="margin-top: 30px;float: right;">
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					background
					layout="prev, pager, next"
					:total="totalrow"
					:page-size="pageSize">
				</el-pagination>
			</div>

		</div>
	  </div>
	</div>
</template>

<script>
	export default {
		data() {
      var validatePass = (rule, value, callback) => {
      	if (value !== this.ruleForm.regPass) {
      		callback(new Error('两次输入密码不一致!'));
      	} else {
      		callback();
      	}
      };
      var checkphone = (rule, value, callback) => {
      	var vString = value.toString();
      	if (vString.length !== 11) {
      		callback(new Error('不是正确的电话号码格式'));
      	} else {
      		callback();
      	}
      };
		  return {
			formLabelWidth: '120px',
			dialogFormVisible: false,
			loading: false,
      showAdddialog: false,
      radio:'2',
			input: '',
			totalrow:0,
			tableData: [],
			currentPage:1,
			pageSize:5,
			username:'',
      value: '',
			form: {
			  id:'',
			  name: '',
			  username:'',
			  phonenumber:'',
			  enabled:'',
			},
      selectForm: {
      		userName:'',
      		userAccount:'',
      		userNum:'',
      },
      ruleForm: {
      	regAccount: '',
      	regName:'',
      	regNumber:'',
      	checkRegPass:'',
      	regPass:'',
      },
      rules: {
      	regAccount: [
      		{ required: true, message: '请输入您的账户名称', trigger: 'blur' },
      	],
      	regName: [
      		{ required: true, message: '请输入您的真实姓名', trigger: 'blur' },
      	],
      	regNumber: [
      		{ required: true, message: '请输入您的电话号码', trigger: 'blur' },
      		{ validator: checkphone, trigger: 'blur' }
      	],
      	regPass: [
      		{ required: true, message: '请输入您的密码', trigger: 'blur' },
      	],
      	checkRegPass: [
      		{ required: true, message: '请确认您的密码', trigger: 'blur' },
      		{ validator: validatePass, trigger: 'blur' }
      	],
      },
      options: [{
                value: '选项1',
                label: '系统管理员'
              }, {
                value: '选项2',
                label: '普通管理员'
              }, {
                value: '选项3',
                label: '普通用户'
              }]
		  }
		},
		mounted: function () {
			this.loadForm();
		},
		methods: {
			 /*布尔值格式化：cellValue为后台返回的值
			*/
			formatBoolean: function (row, column, cellValue) {
				var ret = ''  //你想在页面展示的值
				if (cellValue) {
					ret = "许用"  //根据自己的需求设定
				} else {
					ret = "禁用"
				}
				return ret;
			},
      //加载所有
			loadForm(){
				this.loading = true;
        this.getRequest("/user/getUser?page="+this.currentPage+"&size="+this.pageSize+"&name="+this.selectForm.userName+"&username="+this.selectForm.userAccount+"&phonenumber="+this.selectForm.userNum).then(resp=> {
        	if (resp && resp.status == 200) {
        		console.log(resp);
              for (let i = 0; i < resp.data.User.length; i++) {
                  if(resp.data.User[i].intepart == 'usepart') resp.data.User[i].intepart = '使用部门';
                  else if(resp.data.User[i].intepart == 'develop') resp.data.User[i].intepart = '研制部门';
                  else if(resp.data.User[i].intepart == 'manufacture') resp.data.User[i].intepart = '制造部门';
                  else if(resp.data.User[i].intepart == 'supplier') resp.data.User[i].intepart = '供应商';
                  else if(resp.data.User[i].intepart == 'emission') resp.data.User[i].intepart = '发射支持部门';
                  else if(resp.data.User[i].intepart == 'developCharge') resp.data.User[i].intepart = '研制主管部门';
              }
        		this.tableData = resp.data.User;
        		this.totalrow = resp.data.Count;
        		this.loading = false;
        	}
				})
		},
      //查询重置
      resetForm(){
      	this.selectForm = {
      			userName:'',
      			userAccount:'',
      			userNum:'',
      		};
      	this.currentPage = 1;
      	this.loadForm();
      },
      //修改用户
			update(){
				this.$confirm('此操作将更新用户信息, 是否继续?', '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
				  this.postRequest("/user/updateUser?id="+this.form.id+"&phonenumber="+this.form.phonenumber+"&enabled="+this.form.enabled).then(resp=> {
					if (resp && resp.status == 200) {
						console.log(resp);
						this.dialogFormVisible= false;
						this.$message({
						type: 'info',
						message: '修改成功！'
						});
            this.loadForm();
					}
				  })
				}).catch(() => {
				  this.$message({
					type: 'info',
					message: '已取消修改'
				  });
				});

      },
      //将该行数据回显并进行编辑
			handleEdit(index, row) {
			  this.dialogFormVisible= true;
			  console.log(index, row);
			 this.form.id = row.id;
			 this.form.name = row.name;
			 this.form.username = row.username;
			 this.form.phonenumber = row.phonenumber;
			 this.form.enabled = row.enabled;

			},
      //添加用户
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
      // console.log("表单输入的是"+this.ruleForm.regAccount+this.ruleForm.regName+this.ruleForm.regNumber+this.ruleForm.regPass+this.ruleForm.checkRegPass);
      	var _this = this;
      	this.loading = true;
      	this.postRequest('/doRegister', {

      		username: this.ruleForm.regAccount,
          name: this.ruleForm.regName,
          phonenumber: this.ruleForm.regNumber,
      		password: this.ruleForm.regPass,
      		roleid: this.radio,
      	}).then(resp=> {
      		console.log("注册请求");
      		console.log(resp);
      		if (resp && resp.status == 200) {
      			console.log(resp.data.obj.username);
      			this.$confirm('您已添加成功，请点击确定返回用户管理界面', '添加成功', {
      				confirmButtonText: '确定',
      				cancelButtonText: '取消',
      				type: 'warning'
      			}).then(() => {
      				this.loading = false;
              this.showAdddialog = false,
      				this.$message({
      					type: 'success',
      					message: '添加成功!'
      				});
      			}).catch(() => {
      				this.loading = false;
      				this.$message({
      					type: 'info',
      					message: '添加成功',
      				});
      			});
      		}else{
      			this.$alert('添加失败，请点击跳转到添加界面重新添加', '添加失败', {
      				confirmButtonText: '确定',
      				callback: action => {
      					this.loading = false;
      					this.$router.push( "/9_userManage/9_1userManage") ;
      					this.$message({
      						type: 'info',
      						message: `action: ${ 102 }`
      					});
      				}
      			});
      		}
      	  });
            } else {
              console.log('error submit!!');
              return false;
            }
          });

        },
        addUser(){
          this.showAdddialog = true;
        },
        resetForm2(formName) {
        this.ruleForm.regAccount='';
        this.ruleForm.regPass='';
        this.ruleForm.regNumber='';
        this.ruleForm.checkRegPass='';
        this.ruleForm.regName='';
        },
      //删除操作
			handleDelete(index, row) {
			  console.log(index, row);
					console.log(row.id);
					this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
						this.loading = true;
						this.postRequest("/user/deleteUser?id="+row.id).then(resp=> {
							if (resp && resp.status == 200) {
								this.currentPage = 1;
								this.loadForm();
								this.loading = false;
								this.$message({
								  type: 'success',
								  message: '删除成功!'
								});
							}else{
								this.loading = false;
								this.$message({
								  type: 'faild',
								  message: '删除失败!'
								});
							}
						})
					}).catch(() => {
					  this.$message({
						type: 'info',
						message: '已取消删除'
					  });
					});
			},
			handleCurrentChange: function(currentPage){
				this.currentPage = currentPage;
				console.log(currentPage);
				this.loadForm();
			},
      handleClose(done) {
              this.$confirm('确认关闭？')
                .then(_ => {
                  done();
                })
                .catch(_ => {});
      },
			onSearch(selectForm){
				var _this = this;
        this.currentPage = 1,
        console.log("selectForm");
				this.loading = true;
			  this.loadForm();
			},
	  },

	}
</script>

<style>
</style>
