<template>
<div class="login_main">
    <div class='title'>
        <h1>极建</h1>
    </div>
    <div class='login'>
        <p>资质信息</p>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="companyName" >
                <Input type="text" v-model="formInline.companyName" placeholder="企业全称">
                    <Icon type="ios-contacts-outline" slot="prepend"/>
                </Input>
            </FormItem>
            <FormItem prop="companyNum" >
                <Input type="text" v-model="formInline.companyNum" placeholder="营业执照编号">
                    <Icon type="ios-card-outline" slot="prepend"/>
                </Input>
            </FormItem>
            <FormItem prop="companyAccount" >
                <Input type="text" v-model="formInline.companyAccount" placeholder="企业账号">
                    <Icon type="ios-card" slot="prepend"/>
                </Input>
            </FormItem>
            <FormItem prop="name" >
                <Input type="text" v-model="formInline.name" placeholder="法人姓名">
                    <Icon type="ios-contact-outline" slot="prepend"/>
                </Input>
            </FormItem>
            <FormItem prop="idCard" >
                <Input type="text" v-model="formInline.idCard" placeholder="法人身份证号">
                    <Icon type="md-card" slot="prepend"/>
                </Input>
            </FormItem>
            <Upload des='电子印鉴' @changeUrl='changeUrl' v-model="formInline.sealUrl" name='sealUrl' :currentImage='formInline.sealUrl'></Upload>
            <FormItem style="text-align:right">
                <!-- <router-link to="/certification"> -->
                    <Button type="primary" @click="handleSubmit('formInline')">
                        
                        下一步
                    </Button>
                <!-- </router-link> -->
            </FormItem>
        </Form>
    </div>
</div>
    
</template>
<script>
import Upload from '@/components/components/upload'
import { localStorages } from '@/utils/cache.js'
import { mapMutations } from 'vuex';
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
                formInline: localStorages.get('companyInfo') ? JSON.parse(localStorages.get('companyInfo')) : {
                    companyName: '',
                    companyNum:'',
                    companyAccount:'',
                    name:'',
                    idCard:'',
                    sealUrl:''
                },
                ruleInline: {
                    companyName: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    companyNum: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    companyAccount: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    name: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    idCard: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ],
                    sealUrl: [
                        { validator: validateCompanyInfo, trigger: 'blur' }
                    ]
                },
                checkOk:false
            }
        },
        methods: {
            ...mapMutations(['SET_REGISTER_COMPANY_INFO']),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.formInline.sealUrl.length>10) {
                        this.$Message.success('成功!');
                        let that = this
                        let op = {
                            entityName:that.formInline.companyName,
                            userEntityAttrDTOList:[
                                {
                                "attrCode":"businessLicenseNumber(营业执照编号)",
                                "attrValue":that.formInline.companyNum
                            },
                            {
                                "attrCode":"companyBankAccount(企业银行账号)",
                                "attrValue":that.formInline.companyAccount
                            },
                            {
                                "attrCode":"legalPersonName(法人姓名)",
                                "attrValue":that.formInline.name
                            },
                            {
                                "attrCode":"corporateIdNumber(法人身份证号)",
                                "attrValue":that.formInline.idCard
                            },
                            {
                                "attrCode":"businessLicense(电子印鉴)",
                                 "attrValue":that.formInline.sealUrl
                            }
                            ]
                        }
                        localStorages.set('companyInfo',this.formInline,1000*60*60)
                        // this.SET_REGISTER_COMPANY_INFO(op)
                        this.$router.push({path:'/certification'})
                    } else {
                        this.$Message.error('请补充信息!');
                    }
                })
            },
            changeUrl(op){
            this.formInline[op.name] = op.url
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