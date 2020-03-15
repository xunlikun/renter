import request from '@/utils/request'

export function login(data){
    return request({
        url:'/api/renter/user/login',
        method:'post',
        data
    })
}
export function register(data){
    return request({
        url:'/api/renter/user/registerByMobile',
        method:'post',
        data,
        headers:{'json':true}
    })
}
export function checkVerificationCode(data){
    return request({
        url:'/api/renter/user/checkVerificationCode',
        method:'post',
        data
    })
}
export function sendVerificationCode(data){
    return request({
        url:'/api/renter/user/sendVerificationCode',
        method:'post',
        data
    })
}
export function sendSignMobileCode(data){
    return request({
        url:'/api/renter/contract/sendSignMobileCode',
        method:'post',
        data
    })
}
export function sendToOss(data){
    return request({
        url:'/api/renter/user/sendToOss',
        method:'post',
        data
    })
}
export function getCompanyInfo(){
    return request({
        url:'/api/renter/userEntity/getEntityInfo',
        method:'post'
    })
}
export function updataCompanyInfo(data){
    return request({
        url:'/api/renter/userEntity/updateEntityInfo',
        method:'post',
        data
    })
}
export function resetUserInfo(data){
    return request({
        url:'/api/renter/user/resetUserInfo',
        method:'post',
        data
    })
}