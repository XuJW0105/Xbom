import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}
export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }
  getRequest("/config/sysmenu").then(resp=> {
    if (resp && resp.status == 200) {
      var fmtRoutes = formatRoutes(resp.data);

    var jsonData = JSON.stringify(resp.data);
      // console.log("前端收到的返回值："+jsonData);
      router.addRoutes(fmtRoutes);
      store.commit('initMenu', fmtRoutes);

    }
  })
}
export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        require(['../components/' + component + '.vue'], resolve)
        // if (component.startsWith("Home")) {
        //   require(['../components/' + component + '.vue'], resolve)
        // } else if (component.startsWith("1_")) {
        //   require(['../components/1_operationDatabase/' + component + '.vue'], resolve)
        // } else if (component.startsWith("2_")) {
        //   require(['../components/2_reliabilityAnalysis/' + component + '.vue'], resolve)
        // } else if (component.startsWith("3_")) {
        //   require(['../components/3_correlationAnalysis/' + component + '.vue'], resolve)
        // } else if (component.startsWith("4_")) {
        //   require(['../components/4_indicatorAllocation/' + component + '.vue'], resolve)
        // }else if (component.startsWith("5_")) {
        //   require(['../components/5_optimizedOperation/' + component + '.vue'], resolve)
        // }else if (component.startsWith("6_")) {
        //   require(['../components/6_productGuarantee/' + component + '.vue'], resolve)
        // }else if (component.startsWith("7_")) {
        //   require(['../components/7_repairMission/' + component + '.vue'], resolve)
        // }else if (component.startsWith("8_")) {
        //   require(['../components/8_aviationMaterial/' + component + '.vue'], resolve)
        // }else if (component.startsWith("9_")) {
        //   require(['../components/9_maintenenceOutline/' + component + '.vue'], resolve)
        // } else if (component.startsWith("10_")) {
        //   require(['../components/10_userManage/' + component + '.vue'], resolve)
        // }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}
