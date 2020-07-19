import * as types from './mutation-types'

const mutations = {
  [types.ADD_TO_CART](state,goods){
    goods.checked=false;
    state.cartList.push(goods)
  },
  [types.INCREMENT_COUNT](state,payload){
    //state.cartList[index].count+=1
    payload.count+=1;
  }
  /*[types.INCREMENT_COUNT](state,payload){
		  payload.count+=1;
	  },
	  [types.ADD_TO_CART](state,payload){
		  state.cartList.push(payload);
	  }*/

}
export default mutations
