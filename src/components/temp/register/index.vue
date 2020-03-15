<template>
<div class="login_main">
    <div class='title'>
        <h1>极建</h1>
    </div>
    <div class='login'>
        <p>基本信息</p>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="loginName" >
                <Input type="text" v-model="formInline.loginName" placeholder="登录名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password" >
                <Input type="password" v-model="formInline.password" placeholder="密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="passwdCheck" >
                <Input type="password" v-model="formInline.passwdCheck" placeholder="再次输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="mobile" >
                <Input type="tel" v-model="formInline.mobile" placeholder="手机号">
                    <Icon type="ios-phone-portrait" slot="prepend"/>
                </Input>
            </FormItem>
             <Row>
                <Col span="12">
                    <FormItem prop="verificationCode" >
                        <Input type="text" v-model="formInline.verificationCode" placeholder="验证码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                </Col>
                <Col span="12"><Button :style='{float:"right"}' type="primary" :disabled='sendingAuth' @click=" !sendingAuth && sendVerificationCode({mobile:formInline.mobile})">{{sendingAuth ? mis :'获取验证码'}}</Button></Col>
            </Row>
            <FormItem style="text-align:right">
                <!-- <router-link to="/companyInfo"> -->
                <Button type="primary" @click="handleSubmit('formInline')">下一步</Button>
                <!-- </router-link> -->
                
            </FormItem>
        </Form>
    </div>
</div>
    
</template>
<script>
import { localStorages } from '@/utils/cache.js'
import { sendVerificationCode,checkVerificationCode } from '@/api/user.js'
import { mapMutations } from 'vuex'
    export default {
        data () {
            const validateUserName = (rule, value, callback) => {
                if (value === '' || value === ' ') {
                    callback(new Error('请输入用户名'));
                    this.checkOk = false
                } else if(value.length<2){
                    callback(new Error('用户名长度不能小于2!'));
                    this.checkOk = false
                } else{
                    callback();
                    this.checkOk = true
                }
                
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                    this.checkOk = false
                } else if(value.length<6){
                    callback(new Error('密码长度不能小于6!'));
                    this.checkOk = false
                }
                  else {
                    callback();
                    this.checkOk = true
                }
            };
            const validatePassCheckAG = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                    this.checkOk = false
                } else if (value !== this.formInline.password) {
                    callback(new Error('密码不一致!'));
                    this.checkOk = false
                } else {
                    callback();
                    this.checkOk = true
                }
            };
            const validateTel = (rule, value, callback) => {
                if (!(/^1[3456789]\d{9}$/.test(value))) {
                    callback(new Error('请输入正确的手机号码!'));
                    this.checkOk = false
                }else{
                    callback();
                    this.checkOk = true
                }
            };
            const validateAuth = (rule, value, callback) => {

                checkVerificationCode({mobile:this.formInline.mobile,verificationCode:value}).then(res => {
                    if(res.status == '200'){
                        this.checkOk = true
                        callback();
                        this.$route.push({path:'/companyInfo'})
                    }else{
                        this.checkOk = false
                        callback(new Error('验证码出错!'));
                    }
                })
                

            };
            return {
                sendingAuth:false,
                mis:5,

                formInline:localStorages.get('basicInformation') ? 
                JSON.parse(localStorages.get('basicInformation')) : {
                    loginName: '',
                    password: '',
                    passwdCheck:'',
                    mobile:'',
                    verificationCode:''
                },

                ruleInline: {
                    loginName: [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    passwdCheck: [
                         { validator: validatePassCheckAG, trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: validateTel, trigger: 'blur' }
                    ],
                    verificationCode: [
                        { validator: validateAuth, trigger: 'input' }
                    ]
                },
                checkOk:false
            }
        },
        methods: {
            ...mapMutations(['SET_REGISTER']),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('成功!');
                        localStorages.set('basicInformation',this.formInline,1000*60*60)
                        // this.addToUserInfo(this.formInline)
                        this.$router.push('/companyInfo')
                    } else {
                        this.$Message.error('请补充信息!');
                        
                    }
                })
            },
            // addToUserInfo(data){
            //     delete data.passwdCheck
            //     console.log(data)
            //     this.SET_REGISTER(data)
            // },
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
            }
        },
        watch: {
            checkOk(){
                
            }
        },
    }
</script>
<style lang="scss" scoped>
    .login{
        border-radius: 4px;
        background-color:#fff;
        padding: 10px 20px 30px 20px;
        width:400px;
        margin: 60px auto 0 auto;
        &:hover{
            box-shadow:0 0 10px 1px #eee;
        }
        >p{
            font-size:22px;
            line-height:100px;
            font-weight:700;
            color:#2d8cf0;
            opacity:.6;
        }
        >div.caculate{
            >ul{
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row;
                >li{
                    
                }
            }
        }
    }
</style>