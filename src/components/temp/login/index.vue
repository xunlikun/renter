<template>
<div class="login_main">
    <div class='title'>
        <h1>极建</h1>
    </div>
    <div class='login'>
        <p>登录</p>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="user" >
                <Input type="text" v-model="formInline.user" placeholder="登录名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password" >
                <Input type="password" v-model="formInline.password" @on-enter="handleSubmit('formInline')" placeholder="密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem style="text-align:right">
                <Button type="primary" shape="circle" long @click="handleSubmit('formInline')">登录</Button>
            </FormItem>
        </Form>
        <div class="caculate">
            <ul>
                <li> <router-link to="/forget">忘记密码</router-link></li>
            </ul>
        </div>
    </div>
</div>
    
</template>
<script>
import track from '@/utils/track.js'
import Upload from '@/components/components/upload'
import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        components:{Upload},
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
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            ...mapActions(['login']),
            @track.loading
            handleSubmit(name) {
                this.$refs[name].validate( async (valid) => {
                    if (valid) {
                        // this.$Message.success('Success!');
                        await this.login({loginName:this.formInline.user,password:this.formInline.password})

                    } else {
                        this.$Message.error('格式出错!');
                    }
                })
            }
        }
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