import * as types from './mutation-types'

const actions = {
  // addToCart({state, commit}, info) {
  //   return new Promise((resolve) => {
  //     // 1.查看该商品是否已经添加到cartList中
  //     const oldInfo = state.cartList.find(item => item.iid === info.iid)
  //
  //     // 2.如果oldInfo存在, 那么原来的数量加1
  //     if (oldInfo) {
  //       const index = state.cartList.indexOf(oldInfo)
  //       commit(types.INCREMENT_COUNT, index)
  //     } else {
  //       info.count = 1
  //       info.checked = true
  //       commit(types.ADD_TO_CART, info)
  //     }
  //
  //     resolve()
  //   })
  // }

	  //mutations:修改state中状态,并跟踪
	  //有判断等复杂操作就放到actions里面
	  addCart(context,payload){
	    //想要外界知道该操作结束，使用Promise
      return new Promise((resolve) => {
        //payload:新添加商品
        let oldProduct=null;
        //cartList中是否有payload
        for (let item of context.state.cartList)
        {
          if(item.iid===payload.iid){
            oldProduct=item;
          }
        }
        //oldProduct=context.state.cartList.find((item)=>{
        //item.iid=payload.iid;
        //})
        //判断oldProduct
        if(oldProduct){
          context.commit(types.INCREMENT_COUNT,oldProduct);
          resolve('该商品数量+1');
        }else{
          payload.count=1
          context.commit(types.ADD_TO_CART,payload);
          resolve('已将该商品加入到购物车');
        }
      })
	  }

}

export default actions
