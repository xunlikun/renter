import { getInvoicList,confirmGetMoney } from '@/api/invoic.js'
const state = {
    name:'contract'
}

const mutations = {

}

const actions = {
    async getInvoicList({state,commit},op){
        return await  getInvoicList(op)
       },
    async confirmGetMoney({state,commit},op){
        return await confirmGetMoney(op)
    }
}

export default {
    namespace:true,
    state,
    mutations,
    actions
}