import request from '@/utils/request'

export function getInvoicList(data){
    return request({
        url:'/api/renter/invoice/list',
        method:'post',
        data
    })
}
export function getInvoicAmount(data){
    return request({
        url:'/api/renter/invoice/amountPayable',
        method:'post',
        data
    })
}
export function getBalance(){
    return request({
        url:'/api/renter/invoice/balance',
        method:'post'
    })
}
export function submitInvoic(){
    return request({
        url:'/api/renter/invoice/commit',
        method:'post'
    })
}
export function confirmGetMoney(data){
    return request({
        url:'/api/renter/invoice/confirmAmount',
        method:'post',
        data
    })
}