<template>
<div class="login_main">
    <div class='title'>
        <h1>极建</h1>
    </div>
    <div class='login'>
        <p>认证信息</p>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <div class='upload_wrap'>
                <Upload des='企业营业执照' @changeUrl='changeUrl' name='companyPic' :currentImage='formInline.companyPic'></Upload>
            </div>
            <div class='upload_wrap' style="text-align:left">
                <p style="font-size:16px;margin-bottom:6px">注册用户角色：</p>
                <Select v-model="formInline.role" >
                    <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <div class='upload_wrap'>
                <Upload des='法人/授权人身份证(正面)' @changeUrl='changeUrl' name='idFront' :currentImage='formInline.idFront'></Upload>
            </div>
            <div class='upload_wrap'>
                <Upload des='法人/授权人身份证(反面)' @changeUrl='changeUrl' name='idSide' :currentImage='formInline.idSide'></Upload>
            </div>
            <div class='upload_wrap' v-if="this.formInline.role == '被授权人'">
                <Upload des='加盖单位公章的授权书' @changeUrl='changeUrl' name='commonPic' :currentImage='formInline.commonPic'></Upload>
            </div>
            <FormItem style="text-align:right">
                <!-- <router-link to="/waitingPeriod"> -->
                    <Button type="primary" @click="handleSubmit('formInline')">
                        提交
                    </Button>
                <!-- </router-link> -->
            </FormItem>
        </Form>
    </div>
</div>
</template>
<script>
import Upload from '@/components/components/upload'
import track from '@/utils/track.js'
import { register } from '@/api/user.js'
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { localStorages } from '@/utils/cache.js'
    export default {
        components:{Upload},
        data () {
            const validateCompanyInfo = (rule, value, callback) => {
                if (value === '' || value === ' ') {
                    callback(new Error('请输入'));
                    this.checkOk = false
                }
                else{
                    callback();
                    this.checkOk = true
                }
                
            };
            return {
                formInline: localStorages.get('verificationInformation') ? JSON.parse(localStorages.get('verificationInformation')) : {
                    companyPic:'',
                    role:'法人',
                    idFront:'',
                    idSide:'',
                   commonPic:''
                },
                ruleInline: {
                    companyPic:[
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    role:[
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    idFront:[
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    idSide:[
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ]
                },
                roles: [
                    {
                        value: '法人',
                        label: '法人'
                    },
                    {
                        value: '被授权人',
                        label: '被授权人'
                    }
                ]
            }
        },
        computed: {
            ...mapGetters(['registerData'])
        },
        methods: {
            ...mapMutations(['SET_REGISTER_COMPANY_PIC']),
            ...mapActions(['register']),
            @track.loading
           async handleSubmit(name) {
                let flag = true
                if(this.formInline.role == '法人'){
                    delete this.formInline.commonPic
                    for (const key in this.formInline) {

                    if (key == 'commonPic') continue;
                    this.formInline[key].length>=2 ? flag = true : flag = false

                    }
                    
                }else if(this.formInline.role == '被授权人'){
                    if(!this.formInline.commonPic)this.formInline.commonPic = ''
                    for (const key in this.formInline) {
        
                    this.formInline[key].length>=2 ? flag = true : flag = false

                    }
                };
                if(flag){
                        // this.$Message.success('Success!');
                        let op = {
                            userEntityAttrDTOList:[
                            {
                                 "attrCode":"theElectronicSignature(企业营业执照)",
                                 "attrValue":this.formInline.companyPic
                            },
                            {
                                  "attrCode":"RegisteredUserRole(注册用户角色)",
                                  "attrValue":this.formInline.role
                            },
                            {
                                 "attrCode":"theFrontOfIDCard(法人/授权人身份证(正面))",
                                 "attrValue":this.formInline.idFront
                            },
                            {
                                "attrCode":"reverseSideOfIdCard(法人/授权人身份证(反面))",
                                "attrValue":this.formInline.idSide
                            },
                            {
                                "attrCode":"authorization(加盖单位公章的授权书)",
                                "attrValue":this.formInline.commonPic
                            }
                        ]
                        }

                        if(this.formInline.role == '法人'){
                            for (let index = 0; index < op.userEntityAttrDTOList.length; index++) {
                                if(op.userEntityAttrDTOList[index].attrCode == "authorization(加盖单位公章的授权书)"){
                                    op.userEntityAttrDTOList.splice(index,0)
                                }
                                
                            }
                        }
                        
                        localStorages.set('verificationInformation',this.formInline,1000*60*60)
                        // this.SET_REGISTER_COMPANY_PIC(op)
                        
                        await this.register(this.registerData)
                        
                    }else{
                        this.$Message.error('请补充信息!');

                    }
                
            },
            changeUrl(op){
            this.formInline[op.name] = op.url
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
        .upload_wrap{
            margin:20px 0;
        }
    }
</style>