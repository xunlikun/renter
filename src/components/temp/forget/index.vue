<template>
<div class="login_main">
    <div class='title'>
        <h1>极建</h1>
    </div>
    <div class='login'>
    <p>验证</p>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="mobile">
                <Input type="text" v-model="formInline.mobile" placeholder="注册手机号">
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
                <Col span="12"><Button :style='{float:"right"}' type="primary" :disabled='sendingAuth' @click=" !sendingAuth && sendVerificationCode({mobile:formInline.mobile,type:'resetPassWord'})">{{sendingAuth ? mis :'获取验证码'}}</Button></Col>
            </Row>
            <FormItem style="text-align:right">
                <!-- <router-link to="/reset"> -->
                    <Button type="primary" @click="handleSubmit('formInline')">
                        下一步
                    </Button>
                <!-- </router-link> -->
            </FormItem>
        </Form>
        <div class="caculate">
            <ul>
                <li> <router-link to="/login">返回登录</router-link> </li>
            </ul>
        </div>
    </div>
</div>
    
</template>
<script>
import { sendVerificationCode,checkVerificationCode } from '@/api/user.js'
import { mapMutations } from 'vuex'
    export default {
        data () {
            const validateAuth = (rule, value, callback) => {
                checkVerificationCode({mobile:this.formInline.mobile,verificationCode:value,type:'resetPassWord'}).then(res => {
                    if(res.status == '200'){
                        console.log(res.data)
                        this.SET_TEMP_TOKEN(res.data)
                        callback();
                        
                    }else{
                        
                        callback(new Error('验证码出错!'));
                    }
                })
                

            };
            const validateMobile = (rule, value, callback) => {
                if (!(/^1[3456789]\d{9}$/.test(value))) {
                    callback(new Error('请输入正确的手机号码!'));
                    this.checkOk = false
                }else{
                    callback();
                    this.checkOk = true
                }
            };
            return {
                formInline: {},
                sendingAuth:false,
                mis:5,
                ruleInline: {
                    mobile: [
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    verificationCode: [
                        { validator: validateAuth, trigger: 'input' },
                    ]
                }
            }
        },
        methods: {
            ...mapMutations(['SET_TEMP_TOKEN']),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // this.$Message.success('Success!');
                        this.$router.push({name:'Reset'})
                    } else {
                        this.$Message.error('失败!');
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
                        this.$Message.error('手机号未注册或不正确!');
                    }
                })
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