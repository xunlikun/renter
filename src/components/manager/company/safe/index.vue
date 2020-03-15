<template>
    <Tabs size="small">
        <TabPane label="更改密码">
            <div class='main'>
                <Form ref="formInline" :model="data" :rules="ruleInline">
                    <Row>
                        <Col span="12">
                            <FormItem prop="verificationCode" >
                                <Input type="text" v-model="data.verificationCode" placeholder="验证码">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12" style='padding-left:25px'><Button type="primary" :disabled='sendingAuth' @click=" !sendingAuth && sendVerificationCode({mobile:data.mobile,type:'resetPassWord'})">{{sendingAuth ? mis :'获取验证码'}}</Button></Col>
                    </Row>
                    <FormItem prop="password" label="新密码">
                        <Input type="text" v-model="data.password" placeholder="新密码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="Againpassword" label="再次输入">
                        <Input type="text" v-model="data.Againpassword" placeholder="新密码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem style="text-align:right">
                        <!-- <router-link to="/companyInfo"> -->
                        <Button type="primary" @click="handleSubmit('formInline')">更新</Button>
                        <!-- </router-link> -->
                        
                    </FormItem>
                </Form>
            </div>
        </TabPane>
        <TabPane label="更改手机">
            <div class='main'>
                <Form ref="formInlineMobile" :model="dataMobile" :rules="ruleInlineMobile">
                    <Row>
                        <Col span="12">
                            <FormItem prop="verificationCode">
                                <Input type="text" v-model="dataMobile.verificationCode" placeholder="旧手机验证码">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12" style='padding-left:25px'><Button type="primary" :disabled='sendingAuth' @click=" !sendingAuth && sendVerificationCode({mobile:data.mobile,type:'resetMobile'})">{{sendingAuth ? mis :'获取验证码'}}</Button></Col>
                    </Row>
                    <FormItem prop="newMobile" label="新手机号">
                        <Input type="text" v-model="dataMobile.newMobile" placeholder="新手机号">
                            <Icon type="ios-phone-portrait" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem prop="NewVerificationCode">
                                <Input type="text" v-model="dataMobile.NewVerificationCode" placeholder="新手机验证码">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12" style='padding-left:25px'><Button type="primary" :disabled='sendingAuthNew' @click=" !sendingAuthNew && sendVerificationCodeNew({mobile:dataMobile.newMobile})">{{sendingAuthNew ? misNew :'获取验证码'}}</Button></Col>
                    </Row>
                    <FormItem style="text-align:right">
                        <!-- <router-link to="/companyInfo"> -->
                        <Button type="primary" @click="handleSubmit('formInlineMobile')">更新</Button>
                        <!-- </router-link> -->
                        
                    </FormItem>
                </Form>
            </div>
        </TabPane>
    </Tabs>
</template>
<script>
import { resetUserInfo } from '@/api/user.js'
import { sendVerificationCode,checkVerificationCode } from '@/api/user.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value == '' || value == ' ') {
                    callback(new Error('请输入密码'));
                    
                } else if(value.length<6){
                    callback(new Error('密码长度不能小于6!'));
                    
                }
                  else {
                    callback();
                    
                }
                callback();
            };
            const validatePassCheckAG = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                    
                } else if (value !== this.data.password) {
                    callback(new Error('密码不一致!'));
                    
                } else {
                    callback();
                    
                }
            };
            const validateAuth = (rule, value, callback) => {

                checkVerificationCode({mobile:this.data.mobile,verificationCode:value,type:'resetPassWord'}).then(res => {
                    if(res.status == '200'){
                        this.SET_TEMP_TOKEN(res.data)
                        callback();
                        
                    }else{
                        
                        callback(new Error('验证码出错!'));
                    }
                })
                

            };
            const validateAuthMobile = (rule, value, callback) => {

                checkVerificationCode({mobile:this.dataMobile.mobile,verificationCode:value,type:'resetMobile'}).then(res => {
                    if(res.status == '200'){
                        this.SET_TEMP_TOKEN(res.data)
                        callback();
                        
                    }else{
                        
                        callback(new Error('验证码出错!'));
                    }
                })
                

            };
            const validateAuthNewMobile = (rule, value, callback) => {

                checkVerificationCode({mobile:this.dataMobile.newMobile,verificationCode:value}).then(res => {
                    if(res.status == '200'){
                        this.SET_TEMP_TOKEN(res.data)
                        callback();
                        
                    }else{
                        
                        callback(new Error('验证码出错!'));
                    }
                })
                

            };
            return {
                sendingAuth:false,
                sendingAuthNew:false,
                mis:5,
                misNew:5,
                data:{},
                dataMobile:{},

            ruleInline: {
                    verificationCode: [
                        { validator: validateAuth, trigger: 'input' }
                    ],
                    "password": [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    "Againpassword": [
                         { validator: validatePassCheckAG, trigger: 'blur' }
                    ]
                },
            ruleInlineMobile:{
                verificationCode: [
                        { validator: validateAuthMobile, trigger: 'input' }
                    ],
                NewVerificationCode: [
                        { validator: validateAuthNewMobile, trigger: 'input' }
                    ]
            }
            }
        },
        created() {
            this.data.mobile = this.userInfo.mobile
            this.dataMobile.mobile = this.userInfo.mobile
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            ...mapMutations(['SET_TEMP_TOKEN','DELETE_TOKEN']),
            async handleSubmit(name) {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {

                        if(name == "formInlineMobile"){
                            let msg = (await resetUserInfo({mobile:this.dataMobile.newMobile})).status

                            if(msg == 200){
                                this.$Message.success('手机修改成功!');
                            }else{
                                this.$Message.error('手机修改失败!');
                            }
                        }else{
                            let msg = (await resetUserInfo({password:this.data.password})).status

                            if(msg == 200){
                                this.$Message.success('密码修改成功!请重新登录');
                                this.DELETE_TOKEN()
                            }else{
                                this.$Message.error('密码修改失败!');
                            }
                        }
                        
                        
                        
                    } else {

                        this.$Message.error('请补充信息!');
                        
                    }
                })
            },
            sendVerificationCode(data){
                sendVerificationCode(data).then(res => {
                    if(res.status == '200'){
                        this.sendingAuth = true
                        let timer = setInterval(()=>{
                            this.mis --
                            if(this.mis == 0){
                                clearInterval(timer)
                                this.mis = 5
                                this.sendingAuth = false
                            }
                        },1000)
                        
                    }else{
                        this.sendingAuth = false
                    }
                })
            },
            sendVerificationCodeNew(data){
                sendVerificationCode(data).then(res => {
                    if(res.status == '200'){
                        this.sendingAuthNew = true
                        let timer = setInterval(()=>{
                            this.misNew --
                            if(this.misNew == 0){
                                clearInterval(timer)
                                this.misNew = 5
                                this.sendingAuthNew = false
                            }
                        },1000)
                        
                    }else{
                        this.sendingAuthNew = false
                    }
                })
            }
        },
}
</script>
<style lang="scss" scoped>
    .main{
        margin: 0 auto;
        width:500px;
    }
</style>