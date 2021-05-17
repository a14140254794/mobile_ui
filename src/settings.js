/****
 * 启用配置
 * **/


let initFn = function(VC = false){
  if(VC){
    const VConsole = require('vconsole')
    new VConsole();
  }
}

export {
  initFn
}
