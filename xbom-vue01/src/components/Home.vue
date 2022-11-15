<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">&nbsp;&nbsp;基于XBOM的数据管理平台</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
              欢迎,{{user.name}}
              <i><img src="../assets/resource/user2.png"
                  style="width: 40px;height: 40px;margin-right: 5px;margin-left: 40px;border-radius: 40px" /></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 100%;text-align: left;">
           <el-menu style="background: #ececec;width: 100%;" unique-opened router>
              <template v-for="(item,index) in this.routes" v-if="!item.hidden">
                <el-submenu :key="index" :index="index+''">
                  <template slot="title">
                    <i :class="item.iconCls" style="color: #116ABE;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                  <!-- 二级菜单 -->
                  <template v-for="(child2,index2) in item.children">
                   <el-submenu :key="index2" :index="child2.path"
                      v-if="child2.children&&child2.children.length>0">
                      <template slot="title">
                        <span slot="title">{{child2.name}}</span>
                      </template>
                      <!-- 若有三级菜单,展示三级菜单 -->
                      <el-menu-item width="100%"
                        v-for="(child3,index3) in child2.children" :index="child3.path" :key="index3+''">{{child3.name}}
                      </el-menu-item>
                      <!-- 三级菜单 -->
                    </el-submenu>
                    <!-- 若无三级菜单,展示二级菜单 -->
                   <el-menu-item v-else :key="child2.path" :index="child2.path" style="padding-left: 20px;">
                      <icon :name="child2.iconCls&&child2.iconCls" :w="16" :h="16"></icon>
                      <span style="margin-left:8px">{{child2.name}}</span>
                    </el-menu-item>
                  </template>
                  <!-- 二级菜单 -->
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  export default {
    mounted: function() {
      this.loadNF();
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.getRequest("/user/getOneUser?uid=" + this.$store.state.user.id).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp);
            this.imageUrl = resp.data.User[0].userimage
          }
        })
      },
      beforeAvatarUpload(file) {
        this.upLoadData.title = this.$store.state.user.username;
        this.upLoadData.id = this.$store.state.user.id;
        this.upLoadData.index = this.$store.state.user.name;
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      loadNF() {
        var _this = this;
      },
      goChat() {
        this.$router.push({
          path: '/chat'
        });
      },
      getUserInfo() {
        console.log(this.$store.state.user.id)
        this.getRequest("/user/getOneUser?uid=" + this.$store.state.user.id).then(resp => {
          if (resp && resp.status == 200) {
            console.log(resp);
            this.imageUrl = resp.data.User[0].userimage;
            this.userinfo = resp.data.User[0];
          }
        })
      },
      handleCommand(cmd) {
        var _this = this;
        if (cmd == 'logout') {
          this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.getRequest("/logout");
            _this.$store.commit('logout');
            _this.$router.replace({
              path: '/'
            });
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        } else if (cmd == 'personalCen') {
          this.personalCenter = true;
          this.getUserInfo();
        }
      }
    },
    data() {
      return {
        isCollapse: false,
        userinfo: [],
        upLoadData: {
          title: '',
          id: '',
          index: ''
        },
        imageUrl: '',
        radio: '1',
        radio2: '1',
        input: '',
        value1: '',
        isDot: false,
        personalCenter: false,
        fill: "fill",
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      routes() {
        return this.$store.state.routes
      }
    }
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
  .home-header {
    background-color: #0d5599;
    color: #333;
    /* text-align: center; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }
  .home-aside {
    background-color: #ECECEC;
  }
  .home-main {
    background-color: #fff;
    color: #000;
    /* text-align: center; */
    margin: 0px;
    padding: 0px;
    ;
  }
  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }
  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }
  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }
</style>
