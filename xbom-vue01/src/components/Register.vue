<template>
  <div>
<!--    <img class="bgone" src="../assets/login/Register.jpg"/>-->
    <img class="bgone" src="../assets/login/1.jpg" />
    <img class="pic2" src="../assets/login/a.png" />
    <div style="position: absolute;z-index: 999;top: 2rem;left: 26.8rem;">
      <span style="font-size: 40px;color: dodgerblue">基于XBOM的数据管理平台账号注册</span>
<!--      <span style="font-size: 40px;">&emsp;|&emsp;</span>-->
<!--      <span style="font-size: 30px;">账号注册</span>-->
    </div>
    <div class="table2">
<!-- <h2 style="margin-left: 20rem;color: #116abe;margin-top: 2rem">-->
<!--  如注册遇到问题，请联系管理员-->
<!-- </h2>-->
      <div style="position: absolute;right: 15%;top: 1rem;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-loading="loading">
          <div style="width: 20rem;">
            <span style="">账号：</span>
          </div>
          <div style="width: 20rem;margin-top: 0.5rem">
            <el-form-item prop="regAccount">
              <el-input placeholder="账号" type="text" prefix-icon="el-icon-user" v-model="ruleForm.regAccount"></el-input>
            </el-form-item>

          </div>
          <div style="width: 20rem;margin-top: 1rem">
            <span style="">真实姓名：</span>
          </div>
          <div style="width: 20rem;margin-top: 0.5rem;">
            <el-form-item prop="regName">
              <el-input placeholder="真实姓名" type="text" prefix-icon="el-icon-place" v-model="ruleForm.regName"></el-input>
            </el-form-item>
          </div>
          <div style="width: 20rem;margin-top: 1rem">
            <span style="">电话号码：</span>
          </div>
          <div style="width: 20rem;margin-top: 0.5rem;">
            <el-form-item prop="regNumber" >
              <el-input placeholder="电话号码" type="text" prefix-icon="el-icon-phone-outline"
                        v-model="ruleForm.regNumber"></el-input>
            </el-form-item>
          </div>
          <div style="width: 20rem;margin-top: 1rem">
            <span style="">密码：</span>
          </div>
          <div style="width: 20rem;margin-top: 0.5rem;">
            <el-form-item prop="regPass">
              <el-input placeholder="密码" type="password" prefix-icon="el-icon-c-scale-to-original"
                        v-model="ruleForm.regPass"></el-input>
            </el-form-item>
          </div>
          <div style="width: 20rem;margin-top: 1rem">
            <span style="">确认密码：</span>
          </div>
          <div style="width: 20rem;margin-top: 0.5rem;">
            <el-form-item prop="checkRegPass">
              <el-input placeholder="确认密码" type="password" prefix-icon="el-icon-c-scale-to-original"
                        v-model="ruleForm.checkRegPass"></el-input>
            </el-form-item>
          </div>
          <div style="width: 20rem;margin-top: 1rem;">
            <el-select placeholder="请选择您的角色" v-model="ruleForm.intePart" style="width: 20rem;">
              <el-option label="使用部门" value="usepart"></el-option>
              <el-option label="研制部门" value="develop"></el-option>
              <el-option label="制造部门" value="manufacture"></el-option>
              <el-option label="供应商" value="supplier"></el-option>
              <el-option label="发射支持部门" value="emission"></el-option>
              <el-option label="研制主管部门" value="developCharge"></el-option>
            </el-select>
          </div>
          <div style="width: 20rem;margin-top: 1rem;display: flex;justify-content:space-between">
            <el-radio v-model="radio" label="2">我是管理员</el-radio>
            <el-radio v-model="radio" label="3">我是普通用户</el-radio>
          </div>
          <div style="width: 20rem;margin-top: 1rem;">
            <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            <el-button @click="resetForm('ruleForm')" style="float: right;">重置</el-button>
          </div>
        </el-form>
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
        loading: false,
        radio: '2',
        ruleForm: {
          regAccount: '',
          regName: '',
          regNumber: '',
          checkRegPass: '',
          regPass: '',
          intePart:'',
        },
        rules: {
          regAccount: [
            {required: true , message: '请输入您的账户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          regName: [
            {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
          ],
          regNumber: [
            {required: true, message: '请输入您的电话号码', trigger: 'blur'},
            {validator: checkphone, trigger: 'blur'}
          ],
          regPass: [
            {required: true, message: '请输入您的密码', trigger: 'blur'},
          ],
          checkRegPass: [
            {required: true, message: '请确认您的密码', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            this.loading = true;
            this.postRequest('/doRegister', {
              username: this.ruleForm.regAccount,
              password: this.ruleForm.regPass,
              phonenumber: this.ruleForm.regNumber,
              name: this.ruleForm.regName,
              roleid: this.radio,
              intepart: this.ruleForm.intePart,
            }).then(resp => {
              console.log("注册请求");
              console.log(resp);
              if (resp && resp.status == 200) {
                console.log(resp.data.obj.username);
                this.$confirm('您已注册成功，请点击确定返回登陆界面', '注册成功', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.loading = false;
                  this.$router.push({
                    path: '/Login',
                    name: 'Login',
                    params: {
                      username: resp.data.obj.username,
                      password: resp.data.obj.password
                    }
                  });
                  this.$message({
                    type: 'success',
                    message: '注册成功!'
                  });
                }).catch(() => {
                  this.loading = false;
                  this.$message({
                    type: 'info',
                    message: '注册成功'
                  });
                });
              } else {
                this.$alert('该用户已存在，注册失败，请点击跳转到注册界面重新注册', '注册失败', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.loading = false;
                    this.$router.push("/Register");
                    this.$message({
                      type: 'info',
                      // message: `action: ${102}`
                      message : '该用户已存在'
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
      resetForm(formName) {
        this.ruleForm.regAccount = '';
        this.ruleForm.regPass = '';
        this.ruleForm.regNumber = '';
        this.ruleForm.checkRegPass = '';
        this.ruleForm.regName = '';
      },
    }
  }
</script>
<style>
  .bgone {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
  }
  .table2 {
    background-color: #FFFFFF;
    width: 960px;
    height: 600px;
    position: absolute;
    top: 3%;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
  }
  input {
    height: 55px;
    width: 373px;
    text-indent: 10px;
    outline: none;
    background: #eef6fd;
    border-bottom: 2px #d6e7fa solid;
  }
  .password input {
    border: 0;
  }
  #yonghu img {
    height: 30px;
    position: absolute;
    left: 10px;
    top: 13px;
  }

  .pic2{
    width: 592px;
    height: auto;
    position: absolute;
    top:103px;right: 453px;left: 0;bottom: 0;margin: auto;
    z-index: 1;
  }
</style>
