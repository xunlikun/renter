import { getProjectList } from '@/api/project.js'
import  ViewUI from 'view-design'
const state = {
    name:'project'
}

const mutations = {
    
}

const actions = {
    async getProjectList({state,commit},op){
    return await  getProjectList(op)
   }
}

export default {
    namespace:true,
    state,
    mutations,
    actions
}