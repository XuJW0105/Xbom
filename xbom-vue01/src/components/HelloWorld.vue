<!--<template>-->
<!--  <div class="layout">-->
<!--    <Menu mode="horizontal" theme="light" active-key="1">-->
<!--      <div class="layout-nav" style="float: left;margin-left: 5%">-->
<!--        <router-link tag="li" v-for="(item,index) in title_list" :key="index" :to="item.url">-->
<!--					<span ref="spans" :style="{color: activeStep === index ? 'red' : '#000000'}"-->
<!--                @click="jump(index)">-->
<!--							<Icon v-bind:type="item.icon"></Icon>-->
<!--							{{item.title}}-->
<!--					</span>-->
<!--        </router-link>-->
<!--      </div>-->
<!--      <el-button style="margin-top: 10px;margin-right: 2%;float: right" type="primary" @click="Login">登录/注册</el-button>-->
<!--    </Menu>-->
<!--    <div @scroll="onScroll">-->
<!--      <div>-->
<!--				<span>-->
<!--					<el-carousel trigger="click" height="93vh">-->
<!--						<el-carousel-item v-for="item in imgList" :key="item.id">-->


<!--        <div>-->
<!--								&lt;!&ndash; <h2 style="float: left;margin-left: 10%;margin-top: 5%;font-size: 52px">基于XBOM的数据管理平台</h2> &ndash;&gt;-->
<!--        </div>-->
<!--								<img ref="image" :src="item.idView" class="banner_img"-->
<!--                     style="float: right;margin-right: 10%;margin-top: 5%;height: 93vh"/>-->
<!--              <div style=" position:absolute;z-index=99;flex-direction:row;text-align:center;margin: 0 auto;top: 25vh">-->
<!--                <h2  style="font-size: 68px;color: white;margin-left: 3.5%;width: 100%">基于全寿命周期数据总线的XBOM数据管理平台</h2>-->
<!--              </div>-->
<!--              <div>-->

<!--                <div style="width: 100%; position:absolute;top:85vh;z-index=100;flex-direction: row;display:flex;text-align:center;margin: 0 auto;background-color: white;padding: 10px;">-->
<!--									<img class="icon-photoSchoolName" src="../assets/resource/研究所logo.png" style="width: 45px;height: 45px background-color:red;margin-left: 30%">-->
<!--									<h2 class="schoolName" style="color: black;text-align:center;font-size: 40px;line-height: 40px;margin-left: 20px;">可靠性与运行支持工程研究所</h2>-->
<!--								</div>-->
<!--                </div>-->
<!--						</el-carousel-item>-->
<!--					</el-carousel>-->
<!--				</span>-->
<!--      </div>-->
<!--      &lt;!&ndash;      <div class="scroll-item">-->
<!--              <span>-->
<!--                <div class="layout-content" id="2" style="padding-top: 120px;">-->
<!--                  <h1 style="text-align: center; font-size: 2.5rem; ">助力民机运营，降低维修成本</h1>-->
<!--                  <div style="display: flex;">-->
<!--                    <div style="flex-direction:column-reverse;margin-right: 2.5%;margin-left: 2.5%;margin-bottom: 2.5%">-->
<!--                      <div style="display: flex;justify-content : space-between;">-->
<!--                            <el-card shadow="hover">-->
<!--                              <div style="display:flex; ">-->
<!--                                <Icon type="ios-people" size="40" color="#157dbc"></Icon>-->
<!--                                <h2-->
<!--                                  style="font-size: 1.5rem;margin-left: 30px;  text-align: center;line-height: 40px;">航材配置模块</h2>-->
<!--                              </div>-->
<!--                              <p style="font-size: 0.8rem;margin-top:15px ;margin-bottom: 10px;">&emsp;&emsp;航材备件是航线维修的主要资源，维修资源的配置水平会直接影响到航线维修的质量。在航材库存管理的过程中，如果航材库存过多，会增加库存成本，从而减少维修公司的流动资金；如果航材库存过少，会导致民机因缺件而出现停场延误。因此航材的不合理配置会造成维修成本和维修时间的增加，合理的维修资源配置不但会减少成本损失，同时会增加民机的安全性。因此航空公司需要在维修基地合理配置维修资源，以提高维修资源的利用率、降低维修费用为目标，进而优化企业的维修成本-->
<!--                              </p>-->
<!--                            </el-card>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </span>-->
<!--            </div> &ndash;&gt;-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--    export default {-->
<!--        methods: {-->
<!--            jump(index) {-->
<!--                var items = document.querySelectorAll(".scroll-item");-->
<!--                for (var i = 0; i < items.length; i++) {-->
<!--                    if (index === i) {-->
<!--                        items[i].scrollIntoView({-->
<!--                            block: "start",//默认跳转到顶部-->
<!--                            behavior: "smooth"//滚动的速度-->
<!--                        });-->
<!--                    }-->
<!--                }-->
<!--            },-->
<!--            onScroll(e) {-->
<!--                let scrollItems = document.querySelectorAll(".scroll-item");-->
<!--                for (let i = scrollItems.length - 1; i >= 0; i&#45;&#45;) {-->
<!--                    // 判断滚动条滚动距离是否大于当前滚动项可滚动距离-->
<!--                    let judge =-->
<!--                        e.target.scrollTop >=-->
<!--                        scrollItems[i].offsetTop - scrollItems[0].offsetTop;-->
<!--                    if (judge) {-->
<!--                        this.activeStep = i;-->
<!--                        break;-->
<!--                    }-->
<!--                }-->
<!--            },-->
<!--            Login() {-->
<!--                this.$router.push('/Login')-->
<!--            },-->
<!--        },-->
<!--        data() {-->
<!--            return {-->
<!--                activeStep: 0,-->
<!--                title_list: [-->
<!--                    {title: '平台首页', icon: 'ios-analytics', url: '#'},-->
<!--                    {title: '平台介绍', icon: 'ios-keypad', url: '#'},-->
<!--                    {title: '系统优势', icon: 'ios-navigate', url: '#'},-->
<!--                ],-->
<!--                imgList: [-->
<!--                    {id: 0, idView: require('../assets/resource/火箭发射.jpg'), idText: "基于XBOM的数据管理平台"},-->
<!--                    // {id: 1, idView: require('../assets/resource/bg-4.jpg'), idText: "助力XBOM数据可视化及变更管理"},-->
<!--                ]-->
<!--            }-->
<!--        }-->
<!--    }-->
<!--</script>-->
<!--<style>-->
<!--  .layout {-->
<!--    background: #fff;-->
<!--  }-->

<!--  .layout-nav {-->
<!--    display: flex;-->
<!--    float: right;-->
<!--    width: 500px;-->
<!--    margin: 0 auto;-->
<!--    flex-direction: row;-->
<!--    justify-content: space-around;-->
<!--  }-->

<!--  .layout-content {-->
<!--    min-height: 200px;-->
<!--    margin: 15px;-->
<!--    overflow: hidden;-->
<!--    background: #F5F5F5;-->
<!--    border-radius: 4px;-->
<!--  }-->

<!--  .text {-->
<!--    font-size: 14px;-->
<!--  }-->

<!--  .item {-->
<!--    margin-bottom: 18px;-->
<!--  }-->

<!--  .clearfix:before,-->
<!--  .clearfix:after {-->
<!--    display: table;-->
<!--    content: "";-->
<!--  }-->

<!--  .clearfix:after {-->
<!--    clear: both-->
<!--  }-->

<!--  .banner_img {-->
<!--    font-size: 3.25rem;-->
<!--    position: absolute;-->
<!--    height: 650px;-->
<!--    width: 100%;-->
<!--    z-index: -101;-->
<!--    bottom: 0;-->
<!--  }-->
<!--</style>-->



<template>
  <div class="layout">
    <Menu mode="horizontal" theme="light" active-key="1">
      <div class="layout-logo">
        <div style="float: left;display: flex;">
          <img class="icon-logo" src="../assets/resource/xgd.png" style="height: 50px;">
        </div>
      </div>
      <div class="layout-nav" >
        <router-link tag="li" v-for="(item,index) in title_list" :key="index" :to="item.url" >
					<span ref="spans" :style="{color: activeStep === index ? '#157dbc' : '#000000'}"
                @click="jump(index)">
							<Icon v-bind:type="item.icon"></Icon>
							{{item.title}}
					</span>
        </router-link>
      </div>
    </Menu>

    <div class="result" @scroll="onScroll" >
      <div class="scroll-item">
				<span>
					<el-carousel trigger="click" height= "90vh">
						<el-carousel-item v-for="item in imgList" :key="item.id">
							<el-row>
								<h2 class="imgText">{{item.idText}}</h2>
								<div style="left: 43%; position:absolute;top:70vh;z-index=100;flex-direction: row;display:flex;text-align:center;margin: 0 auto;">
									<img class="icon-photoSchoolName" src="../assets/resource/研究所logo.png" style="width: 40px;height: 40px background-color:red;margin-left: -150px;">
									<div class="schoolName" style="color: white;text-align:center;font-size: 36px;line-height: 40px;margin-left: 20px">可靠性与运行支持工程研究所</div>
								</div>
								<el-col ><img ref="image" :src="item.idView" class="banner_img" style="width: 100%;height:90vh;"/></el-col>
							</el-row>
						</el-carousel-item>
					</el-carousel>
				</span>
      </div>
      <div class="scroll-item">
				<span>
					<div class="layout-content" id="2" style="padding-top: 80px;">
						<h1 style="text-align: center; font-size: 2.5rem; ">平台研制流程概览</h1>
						<div style="display: flex;">
							<img src="../assets/resource/研制流程图.png" style="width: 40%;margin-right: 2.5%;margin-left: 2.5%;" />
							<div style="flex-direction:column-reverse;margin-right: 2.5%;width: 55%;">
								<div style="display: flex;justify-content : space-between;">
<!--									<el-row :gutter="24" style="width: 100%;">-->
<!--									  <el-col :span="24">-->
<!--									    <el-card shadow="hover">-->
<!--									    	<div style="display:flex; ">-->
<!--									    		<Icon type="ios-people" size="40" color="#157dbc"></Icon>-->
<!--/*									    		<h2 style="font-size: 1.5rem;margin-left: 30px;  text-align: center;line-height: 40px;">数据库模块</h2>*/-->
<!--									    	</div>-->
									    	<img src="../assets/resource/业务流程分析.jpg" style="width: 100%;margin-right: 2.5%;margin-left: 2.5%;" />
<!--									    </el-card>-->
<!--									  </el-col>-->
<!--									</el-row>-->
								</div>
<!--								<div style="display: flex;justify-content : space-between;margin-top: 20px;">-->
<!--									<el-row :gutter="12" style="width: 100%;">-->
<!--									  <el-col :span="12">-->
<!--									    <el-card shadow="hover">-->
<!--									    	<div style="display:flex; ">-->
<!--									    		<Icon type="ios-stats" size="40" color="#157dbc"></Icon>-->
<!--									    		<h2 style="font-size: 1.5rem;margin-left: 30px;  text-align: center;line-height: 40px;">可靠性关联性</h2>-->
<!--									    	</div>-->
<!--									    	<p style="font-size: 0.8rem;margin-top:15px ;margin-bottom: 10px;">33333<br>&emsp;-->
<!--									    	</p>-->
<!--									    </el-card>-->
<!--									  </el-col>-->
<!--									  <el-col :span="12">-->
<!--									    <el-card shadow="hover">-->
<!--									    	<div style="display:flex; ">-->
<!--									    		<Icon type="md-document" size="40" color="#157dbc"></Icon>-->
<!--									    		<h2 style="font-size: 1.5rem;margin-left: 30px;  text-align: center;line-height: 40px;">可靠性指标</h2>-->
<!--									    	</div>-->
<!--									    	<p style="font-size: 0.8rem;margin-top:15px ;margin-bottom: 10px;">44444</p>-->
<!--									    </el-card>-->
<!--									  </el-col>-->
<!--									</el-row>-->
<!--								</div>-->
							</div>

						</div>
					</div>
				</span>
      </div>
      <div class="scroll-item">
				<span>
					<h1 style="padding-top: 120px;text-align: center; font-size: 2.5rem; margin-bottom: 60px;">系统框架</h1>
					<div class="helpSys" style="width: 100%;display: flex;justify-content:space-around;;">
						<div class="helpSysIn">
							<el-card class="box-card" >
								<div slot="header" class="clearfix" style="font-size: 0.8em;">
									<span>前端框架</span>
									<el-popover
                    placement="right"
                    title="详细介绍"
                    width="800"
                    trigger="click">
										<div>
											Vue简介<br>
											&emsp;&emsp;Vue.js是一套构建用户界面的渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。Vue 的核心库只关注视图层，非常容易与其它库或已有项目整合。另一方面，Vue 完全有能力驱动采用单文件组件和Vue生态系统支持的库开发的复杂单页应用。<br>
											&emsp;&emsp;Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。<br>
											&emsp;&emsp;Vue.js自身不是一个全能框架——它只聚焦于视图层。因此它非常容易学习，非常容易与其它库或已有项目整合。另一方面，在与相关工具和支持库一起使用时，Vue.js 也能完美地驱动复杂的单页应用。<br>

											Vue特点<br>

											易用<br>
											&emsp;&emsp;在有HTML CSS JavaScript的基础上，快速上手。<br>
											灵活<br>
											&emsp;&emsp;简单小巧的核心，渐进式技术栈，足以应付任何规模的应用。<br>
											性能<br>
											&emsp;&emsp;20kb min+gzip 运行大小、超快虚拟 DOM 、最省心的优化。<br>
										</div>
										<el-button style="float: right; padding: 3px 0" type="text" slot="reference">详细介绍</el-button>
									</el-popover>
								</div>
								<div class="text item">
									&emsp;&emsp;本项目前端框架采用Vue，Vue是一套用于构建用户界面的渐进式框架,目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。使用 Virtual DOM，提供了响应式 (Reactive) 和组件化 (Composable) 的视图组件，
									因此可以将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库，同时采用iView和element等相关组件库，使前端界面更加美观，并具有更好的
									交互性，维持了框架的一致性和可控性。
								</div>
							</el-card>
						</div>
						<div class="helpSysImg" style="">
							<img src="../assets/resource/vue.jpg" style="height: 283px; border-radius: 10px;box-shadow: 0px 1px 5px 5px #F5F5F5;"/>
						</div>
					</div>
					<div class="helpSysout" style="width: 100%;display: flex;justify-content:space-around;margin-top: 30px;">
						<div class="helpSysOutin">
							<el-card class="box-card" >
								<div slot="header" class="clearfix" style="font-size: 0.8em;">
									<span>后端框架</span>
									<el-popover
                    placement="right"
                    title="详细介绍"
                    width="800"
                    trigger="click">
										<div>
											SpringBoot简介<br>
											&emsp;&emsp;SpringBoot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。它基于Spring4.0设计，不仅继承了Spring框架原有的优秀特性，而且还通过简化配置来进一步简化了Spring应用的整个搭建和开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。通俗理解，SpringBoot其实不是什么新的框架，它默认配置了很多框架的使用方式，就像 Maven 整合了所有的 Jar 包，Spring Boot 整合了所有的框架。使得依赖包的版本冲突，以及引用的不稳定性等问题得到了很好的解决。<br>
											&emsp;&emsp;Spring Boot 简化了基于 Spring 的应用开发，通过少量的代码就能创建一个独立的、产品级别的 Spring 应用。 Spring Boot 为 Spring 平台及第三方库提供开箱即用的设置。Spring Boot 的核心思想就是约定大于配置，多数 Spring Boot 应用只需要很少的 Spring 配置。采用 Spring Boot 可以大大的简化开发模式，所有想集成的常用框架，它都有对应的组件支持。<br>

											SpringBoot所具备的特征有：<br>
											（1）可以创建独立的Spring应用程序，并且基于其Maven或Gradle插件，可以创建可执行的JARs和WARs；<br>
											（2）内嵌Tomcat或Jetty等Servlet容器；<br>
											（3）提供自动配置的“starter”项目对象模型（POMS）以简化Maven配置；<br>
											（4）尽可能自动配置Spring容器；<br>
											（5）提供准备好的特性，如指标、健康检查和外部化配置；<br>
											（6）绝对没有代码生成，不需要XML配置。<br>

											使用 Spring Boot 的优势<br>
											<br>
											Spring Boot 让开发变得更简单<br>
											使用 Spring Boot 之后我们需要开发一个 web 项目需要哪些操作呢？<br>
											1）登录网址 http://start.spring.io/ 选择对应的组件直接下载<br>
											2）导入项目，直接开发<br>

											Spring Boot 使测试变得更简单<br>
											只需要在项目中引入spring-boot-starter-test依赖包，就可以对数据库、Mock、 Web 等各种情况进行测试。<br>

											Spring Boot 让配置变得更简单<br>
											Spring Boot 的核心思想：<br>&emsp;&emsp;约定优于配置。约定优于配置（convention over configuration），也称作按约定编程，是一种软件设计范式，旨在减少软件开发人员需做决定的数量，获得简单的好处，而又不失灵活性。<br>

											Spring Boot 让部署变得更简单<br>
											内嵌容器不只让部署变得简单，其实在开发调试阶段也会带来非常大的便利性<br>

											Spring Boot 让监控变得更简单<br>
											Spring Boot就是一款自带监控的开源软件 ，Spring Boot Admin 是一个管理和监控 Spring Boot 应用程序的开源软件。<br>

										</div>
										<el-button style="float: right; padding: 3px 0" type="text" slot="reference">详细介绍</el-button>
									</el-popover>

								</div>
								<div class="text item">
									&emsp;&emsp;本项目后端框架采用SpringBoot，SpringBoot是一个简化Spring开发的框架，用来监护spring应用开发。使用SpringBoot可以生成独立的微服务功能单元，
									针对Spring应用程序常见的应用功能，SpringBoot能自动提供相关配置，将代码编译、测试和打包等工作自动化。利用SpringBoot整合mybatis用于持久层框架的搭建，整合redis用于缓存的建立，整合
									SpringSecurity解决角色权限及密码加盐等问题。采用RESTful的代码风格，用于资源定位及操作。
								</div>
							</el-card>
						</div>
						<div class="helpSysImg" >
							<img src="../assets/resource/spring.jpg" style="height: 283px;border-radius: 10px ;box-shadow: 0px 1px 5px 5px #F5F5F5;"/>
						</div>
					</div>

				</span>
      </div>

      <div class="layout-content">
        内容区域
      </div>
      <div class="layout-copy">
        2022 &copy; 冯蕴雯教授课题组
      </div>
    </div>



  </div>
</template>
<script>
export default {
  methods:{
    jump(index) {
      var items = document.querySelectorAll(".scroll-item");
      for (var i = 0; i < items.length; i++) {
        if (index === i) {
          items[i].scrollIntoView({
            block: "start",//默认跳转到顶部
            behavior: "smooth"//滚动的速度
          });
        }
      }
    },
    onScroll(e) {
      let scrollItems = document.querySelectorAll(".scroll-item");
      for (let i = scrollItems.length - 1; i >= 0; i--) {
        // 判断滚动条滚动距离是否大于当前滚动项可滚动距离
        let judge =
          e.target.scrollTop >=
          scrollItems[i].offsetTop - scrollItems[0].offsetTop;
        if (judge) {
          this.activeStep = i;
          break;
        }
      }
    },
  },
  data() {
    return {
      activeStep :0,
      title_list:[
        {title:'平台首页',icon:'ios-analytics',url:'#'},
        {title:'平台概览',icon:'ios-keypad',url:'#'},
        {title:'系统框架',icon:'ios-navigate',url:'#'},
        {title:'登陆/注册',icon:'ios-paper',url:'/Login'},
      ],
      imgList: [
        {id: 0, idView: require('../assets/resource/火箭发射.jpg'),idText:"基于全寿命周期数据总线的XBOM数据管理平台"},
        {id: 1, idView: require('../assets/resource/背景图2.jpg'),idText:"系统支持32位、64位Win7及以上版本的操作系统"},
        {id: 2, idView: require('../assets/resource/背景图3.jpg'),idText:"助力全寿命周期数据总线XBOM数据可视化及变更管理"},
      ]
    }
  }
}
</script>

<style>

.imgText{
  position:absolute;
  top:30vh;
  width:100%;
  color:whitesmoke;
  background-color: rgba(0,0,0,0.1);
  text-align:center;
  z-index:99;
}
.layout{
  background: #fff;

}
.layout-logo{
  width: 250px;
  height: 50px;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 5px;
  left: 60px;
}
.layout-nav{
  display: flex;
  float:right ;
  width: 500px;
  margin: 0 auto;
  flex-direction: row;
  justify-content:space-around;
}
.layout-assistant{
  width: 300px;
  margin: 0 auto;
  height: inherit;
}
.layout-breadcrumb{
  padding: 10px 15px 0;
}
.layout-content{
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background:#F5F5F5;
  border-radius: 4px;
}
.layout-content-main{
  padding: 10px;
}
.layout-copy{
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
li {
  float: left;

}
li>span {
  float: left;
  cursor:pointer;
}
.result {
  width: 100%;
  height: 90vh;
  overflow: scroll;
}
.scroll-item {
  width: 100%;
  height: auto;
  margin-top:20px;

}
.scroll-item>span {
  font-size: 40px;
}
.scroll-item:first-child {
  margin-top: 0;
}
.scroll-item:last-child {
  height: 500px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>
