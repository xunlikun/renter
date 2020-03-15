import request from '@/utils/request'

export function getContractList(data){
    return request({
        url:'/api/renter/contract/list',
        method:'post',
        data
    })
}
export function getContractDetail(data){
    return request({
        url:'/api/renter/contract/getContractDetail',
        method:'post',
        data
    })
}
export function getNextContract(data){
    return request({
        url:'/api/renter/contract/getNextContract',
        method:'post',
        data
    })
}
export function getPreviousContract(data){
    return request({
        url:'/api/renter/contract/getPreviousContract',
        method:'post',
        data
    })
}
export function sign(data){
    return request({
        url:'/api/renter/contract/signed',
        method:'post',
        data,
        headers:{'json':true}
    })
}