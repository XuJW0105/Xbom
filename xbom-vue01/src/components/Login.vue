<template>
	<div>
		<img class="bgone" src="../assets/login/Login.jpg" />
    <div style="position: absolute;z-index: 999;top: 2.5rem;left: 25%">
      <span style="font-size: 40px;color: dodgerblue">基于XBOM的数据管理平台统一身份认证</span>
  </div>
    <div >
      <div style="position: absolute;left: 18rem;top:12rem;z-index: 99999;background-color: rgba(255,250,230,0.8);">
        <div style="margin: 20px">
        <h2 style="font-size:25px;color: #116abe">
          账号登录
        </h2>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading">
          <div style="width: 20rem;margin-top: 2rem">
            <el-input placeholder="账号" type="text" prefix-icon="el-icon-user" v-model="ruleForm.logAccount"></el-input>
          </div>
          <div style="width: 20rem;margin-top: 2rem;">
            <el-input placeholder="密码" type="password" prefix-icon="el-icon-c-scale-to-original" v-model="ruleForm.logPass"></el-input>
          </div>
          <div style="width: 20rem;margin-top: 1rem;margin-right: 20px">
            <router-link to='/Register'><el-button type="text"  style="float: right;" >没有账号？注册</el-button></router-link>
          </div>
          <div style="width: 20rem;margin-top: 2rem;">
            <el-form-item >
              <el-button type="primary" style="width: 100%" @click="submitClick('ruleForm')">登录</el-button>
            </el-form-item>
          </div>
        </el-form>
        </div>
      </div>
    </div>
			<div class="wel">基于XBOM的数据管理平台统一身份认证</div>
	</div>
</template>
<script>
	export default {
    data() {
			return {
				loading: false,
				checked: false,
				ruleForm: {
					logAccount: '',
					logPass:'',
				},
				rules: {
					logAccount: [
						{ required: true, message: '请输入您的账户名称', trigger: 'blur' },
					],
					logPass: [
						{ required: true, message: '请输入您的密码', trigger: 'blur' },
					],
				}
			};
    },
    methods: {
		submitClick: function (formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var _this = this;
					this.loading = true;
					this.postRequest('/login', {
						username: this.ruleForm.logAccount,
						password: this.ruleForm.logPass
					}).then(resp=> {
						_this.loading = false;
						if (resp && resp.status == 200) {
						var data = resp.data;
						this.$store.commit('login', data.obj);
						var path = _this.$route.query.redirect;
						this.$router
						.replace({path: path == '/' || path == undefined ? '/home' : path});
						}
					})
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
    },
	mounted: function () {
	  this.ruleForm.logAccount = this.$route.params.username;
	  this.ruleForm.logPass = this.$route.params.password
	}
  }
</script>
<style>
	.bgone{
		width: 100%;
		height: 100%;
		position: absolute;
		top:0;right: 0;left: 0;bottom: 0;margin: auto;
	}
	.wel{
		width: 960px;
		height: 35px;
		color: #fff;
	    font-size: 30px;
	    position: absolute;
	    top: -7rem;
	    text-align: center;
	}
	input{
	     height: 55px;
	     width: 373px;
	     text-indent: 10px;
	     outline:none;
	     background: #eef6fd;
	     border-bottom:2px #d6e7fa solid ;
	}
	.password input{
		border: 0;
	}
	#yonghu img{
		height: 30px;
		position: absolute;
		left: 10px;
		top: 13px;
	}
</style>
