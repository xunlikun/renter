import { getContractList } from '@/api/contract.js'
import  ViewUI from 'view-design'
const state = {
    name:'contract'
}

const mutations = {
    
}

const actions = {
    async getContractList({state,commit},op){
    return await  getContractList(op)
   }
}

export default {
    namespace:true,
    state,
    mutations,
    actions
}