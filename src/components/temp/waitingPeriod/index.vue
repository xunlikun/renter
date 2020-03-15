<template>
<div>
    <template v-if="$route.name =='WaitingPeriod'">
        <div class='main'>
            <div class="header">
                <h1>等待审核</h1>
                
            </div>
            <div class="msg">
                <p>您的实名认证信息正在审核中，请耐心等待审核结果（最长3个工作日内完成审核）</p>
                <p><span>用户类型：</span><span>企业用户</span></p>
                <p><span>认证方式：</span><span>单位证件认证（单位证件、法人信息）</span></p>
                <p><span>单位名称：</span><span>{{RegisterCompanyInfo.companyName}}</span></p>
                <p><span>单位证件号：</span><span>{{RegisterCompanyInfo.companyNum}}</span></p>
                <p><span>提交时间：</span><span>{{new Date()}}</span></p>
            </div>
        </div>
    </template>
    <template v-else>
        <div class='main'>
            <div class="header">
                <h1>等待审核</h1>
                
            </div>
            <div class="msg" v-if="companyInfo.userEntityAttrDTOList">
                <p>您的实名认证信息正在审核中，请耐心等待审核结果（最长3个工作日内完成审核）</p>
                <p><span>用户类型：</span><span>企业用户</span></p>
                <p><span>认证方式：</span><span>单位证件认证（单位证件、法人信息）</span></p>
                <p><span>单位名称：</span><span>{{companyInfo.entityName}}</span></p>
                <p><span>单位证件号：</span><span>{{companyInfo.userEntityAttrDTOList[0].attrValue}}</span></p>
                <p><span>提交时间：</span><span>{{companyInfo.createTime}}</span></p>
            </div>
        </div>
    </template>
</div>
    
</template>
<script>
import { localStorages } from '@/utils/cache.js'
import { mapActions, mapGetters } from 'vuex'
export default {
    data() {
        return {
            userInfo:localStorages.get('basicInformation') ? JSON.parse(localStorages.get('basicInformation')) : '',
            RegisterCompanyInfo:localStorages.get('companyInfo') ? JSON.parse(localStorages.get('companyInfo')) : ''
        }
    },
    created(){
        this.init()
    },
    computed: {
        ...mapGetters(['companyInfo'])
    },
    methods: {
        ...mapActions(['login']),
        init(){
            if(this.$route.name == 'WaitingPeriod'){
                this.$Message.success('5秒后将自动登录!');
                setTimeout(async ()=>{
                    await this.login({loginName:this.userInfo.loginName,password:this.userInfo.password})
                },5000)
            }
            
        }
    },
}
</script>
<style lang='scss' scoped>
.main{
    text-align: center;    
}
    .msg{
        line-height: 35px;
    }
</style>