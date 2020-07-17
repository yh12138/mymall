export function formatDate(date,fmt) {
  //获取年份
  //+ : 1个或者多个
  //* : 0或者多个
  //？ : 0或者1个
  //RegExp.$1 匹配到的结果
  if (/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
  }
  let o = {
    'M+' :date.getMonth()+1,
    'd+' :date.getDate(),
    'h+' :date.getHours(),
    'H+' :date.getHours()-12,
    'm+' :date.getMinutes(),
    's+' :date.getSeconds()
  }
  for (let k in o){
    if (new RegExp(`(${k})`).test(fmt)){
      let str = o[k] +'';
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length === 1)? str :padLeftZero(str))
    }
  }
  return fmt
};
function padLeftZero(str) {
  return ('00'+str).substr(str.length)
}
//防抖动函数
export function debounce(func,delay){
  let timer=null;
  return function (...args) {
    if (timer)  clearTimeout(timer);
    timer=setTimeout(()=>{
      func.apply(this,args);
    },delay);
  }
}
