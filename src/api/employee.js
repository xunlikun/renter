import request from '@/utils/request'

export function getEmployeeList(data){
    return request({
        url:'/api/renter/employee/list',
        method:'post',
        data
    })
}
export function getEmployeeDetail(data){
    return request({
        url:'/api/renter/employee/getEmployeeDetail',
        method:'post',
        data
    })
}
export function saveEmployeeDetail(data){
    return request({
        url:'/api/renter/employee/save',
        method:'post',
        data
    })
}
export function removeEmployee(data){
    return request({
        url:'/api/renter/employee/delete',
        method:'post',
        data
    })
}