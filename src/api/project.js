import request from '@/utils/request'

export function getProjectList(data){
    return request({
        url:'/api/renter/project/list',
        method:'post',
        data
    })
}
export function getProjectDetail(data){
    return request({
        url:'/api/renter/project/getProjectDetail',
        method:'post',
        data
    })
}
export function saveProjectDetail(data){
    return request({
        url:'/api/renter/project/save',
        method:'post',
        data,
        headers:{'json':true}
    })
}
export function getEmployeeInfo(){
    return request({
        url:'/api/renter/user/selectData',
        method:'post'
    })
}