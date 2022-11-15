<template>
  <div>
    <div class="tab" style="margin-top: 5px;">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-date"></i>系统视角</span>
          <child1 v-if='show1 == true'></child1>
        </el-tab-pane>

        <el-tab-pane name="second">
          <span slot="label"><i class="fa fa-dot-circle-o"></i>初步装配视角</span>
          <child2 v-if='show2 == true'></child2>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>
  import ebomChildOne from './ebomChild/ebomChildOne.vue'
  import ebomChildTwo from './ebomChild/ebomChildTwo.vue'

  export default {
    components:{
      child1:ebomChildOne,
      child2:ebomChildTwo,
    },
    data() {
      return {
        fileURLList:[],
        activeName:'first',
        show1:true,
        //这里show2要默认设置为false
        show2:false,
      }
    },
    methods:{
      handleClick(tab, event){
        console.log(tab, event);
        if(tab.index==0){
          this.show1=true;
          this.show2=false;
          this.activeName= "first";
        }else if(tab.index==1){
          this.show1=false;
          this.show2=true;
          this.activeName= "second";
        }
      }
    }
  }
</script>

<style>
</style>

