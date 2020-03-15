import { login,register,getCompanyInfo } from '@/api/user.js'
import { localStorages } from '@/utils/cache.js'
import { getToken,setToken,delToken } from '@/utils/auth.js'
import ViewUI from 'view-design'
import Router from '@/router'
const state = {
    name:'user',
    userInfo:localStorages.get('userInfo') ? JSON.parse(localStorages.get('userInfo')) : {},
    companyInfo:localStorages.get('companyInfo') ? JSON.parse(localStorages.get('companyInfo')) : {},
    register:localStorages.get('register') ? JSON.parse(localStorages.get('register')) : {
            "loginName":"",
            "password":"",
            "mobile":"",
            "verificationCode":"",
            "userEntityDTO":{
                "entityName":"",
                "entityType":"company",
                "userEntityAttrDTOList":[
                    
                ]
            }
        },
    token:getToken(),
    tempToken:localStorages.get('tempToken') ? localStorages.get('tempToken') : ''
}

const mutations = {
    SET_TEMP_TOKEN(state,value){
        localStorages.set('tempToken',value,1000*60*10)
        state.tempToken = value
    },
    SET_REGISTER(state,op){
        for (const key in op) {
            state.register[key] = op[key]
        }
        let base = localStorages.get('basicInformation') ? JSON.parse(localStorages.get('basicInformation')) : ''
        let company = localStorages.get('companyInfo') ? JSON.parse(localStorages.get('companyInfo')) : ''
        let verification = localStorages.get('verificationInformation') ? JSON.parse(localStorages.get('verificationInformation')) : ''
        if(base && company && verification){
            for (const key in base) {
                if(key == 'passwdCheck') continue;
                state.register[key] = base[key]
            }
            state.register.userEntityDTO.entityName = company.companyName
            let commsg = [
                {
                "attrCode":"businessLicenseNumber(营业执照编号)",
                "attrValue":company.companyNum
                },
                {
                    "attrCode":"companyBankAccount(企业银行账号)",
                    "attrValue":company.companyAccount
                },
                {
                    "attrCode":"legalPersonName(法人姓名)",
                    "attrValue":company.name
                },
                {
                    "attrCode":"corporateIdNumber(法人身份证号)",
                    "attrValue":company.idCard
                },
                {
                    "attrCode":"businessLicense(电子印鉴)",
                     "attrValue":company.sealUrl
                }
            ]

            let vermsg = [
                {
                     "attrCode":"theElectronicSignature(企业营业执照)",
                     "attrValue":verification.companyPic
                },
                {
                      "attrCode":"RegisteredUserRole(注册用户角色)",
                      "attrValue":verification.role
                },
                {
                     "attrCode":"theFrontOfIDCard(法人/授权人身份证(正面))",
                     "attrValue":verification.idFront
                },
                {
                    "attrCode":"reverseSideOfIdCard(法人/授权人身份证(反面))",
                    "attrValue":verification.idSide
                },
                {
                    "attrCode":"authorization(加盖单位公章的授权书)",
                    "attrValue":verification.commonPic
                }
            ]

            state.register.userEntityDTO.userEntityAttrDTOList = commsg.concat(vermsg)


        }else{
            return 500
        }
        localStorages.set('register',state.register,1000*60*60)
     }
    ,
    SET_TOKEN(state){
        setToken(getToken(),{expires:1000*60*60})
        state.token = getToken()
    },
    DELETE_TOKEN(state){
        delToken()
        state.token = ''
        localStorages.clear()
        ViewUI.Message.warning('您已登出！')
        // Router.replace({name:'Login'})
        setTimeout(()=>{
            window.location.reload()
          },500)
    },
    SET_COMPANY_INFO(state,op){
        state.companyInfo = op
        localStorages.set('companyInfo',op,1000*60*60*6)
    }
}

const actions = {
    login({commit,state},option){
        login(option).then(res => {
            if(res.status == 200){
                localStorages.clear()
                localStorages.set('userInfo',{userName:res.data.loginName,userStatus:res.data.userStatus,mobile:res.data.mobile})
                state.userInfo = {userName:res.data.loginName,userStatus:res.data.userStatus,mobile:res.data.mobile}
                setToken(res.data.token,{expires:1000*60*60})
                state.token = res.data.token
                ViewUI.Message.success('登录成功！')
                Router.replace({path:'/manager'})
            }else{
                ViewUI.Message.error('登录失败！')
                Router.replace({path:'/login'})
            }
        })
    },
    getCompanyInfo({commit,state}){
        getCompanyInfo().then(res => {
            if(res.status == 500){
                ViewUI.Message.error('获取公司信息失败！')
            }else{
                commit('SET_COMPANY_INFO',res.data)
            }
        })
    },
    register({commit,state},option){
        if(commit('SET_REGISTER') == 500){
            ViewUI.Message.error('缺失注册信息！')
            return
        }
        register(option).then(res => {
            if(res.status == 200){
                ViewUI.Message.success('注册成功！')
                Router.replace({path:'/waitingPeriod'})
            }else{
                ViewUI.Message.error('注册失败！')
                localStorages.clear()
                Router.replace({path:'/register'})
            }
        })
    }
}

export default {
    namespace:true,
    state,
    mutations,
    actions
}