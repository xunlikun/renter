<template>
<Tabs size="small">
    <TabPane label="基本信息">
    <div class='main' v-if = 'data'>
        <Form ref="formInline" :model="data" :rules="ruleInline">
                    <FormItem prop="entityName" label="企业全称 (不可修改)">
                        <Input type="text" v-model="data.entityName" placeholder="企业全称">
                            <Icon type="ios-contacts-outline" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <FormItem prop="businessLicenseNumber(营业执照编号)" label="营业执照编号 (不可修改)">
                        <Input type="text" v-model="data['businessLicenseNumber(营业执照编号)']" placeholder="营业执照编号">
                            <Icon type="ios-card-outline" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <div>
                    <p style='font-size:14px;line-height:35px'>营业执照</p>
                    <Upload @changeUrl='changeUrl' v-model="data['theElectronicSignature(企业营业执照)']" name='theElectronicSignature(企业营业执照)' :currentImage="data['theElectronicSignature(企业营业执照)']"></Upload>
                    </div>
                    <FormItem prop="legalPersonName(法人姓名)" label="法人姓名">
                        <Input type="text" v-model="data['legalPersonName(法人姓名)']" placeholder="法人姓名">
                            <Icon type="ios-contact-outline" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <FormItem prop="corporateIdNumber(法人身份证号)" label="法人身份证号">
                        <Input type="text" v-model="data['corporateIdNumber(法人身份证号)']" placeholder="法人身份证号">
                            <Icon type="md-card" slot="prepend"/>
                        </Input>
                    </FormItem>
                    <FormItem prop="companyBankAccount(企业银行账号)" label="企业银行账号">
                        <Input type="text" v-model="data['companyBankAccount(企业银行账号)']" placeholder="企业银行账号">
                            <Icon type="ios-card" slot="prepend"/>
                        </Input>
                    </FormItem>
                </Form>
            </div>
        </TabPane>
    </Tabs>
</template>
<script>
import track from '@/utils/track.js'
import { localStorages } from '@/utils/cache.js'
import { updataCompanyInfo } from '@/api/user.js'
import { mapActions } from 'vuex'
import  Upload  from '@/components/components/upload'
export default {
    components:{Upload},
    data() {
        const validateUserName = (rule, value, callback) => {
                if (value === '' || value === ' ') {
                    callback(new Error('请补充信息'));
                } else{
                    callback();
                    if(rule.fullField == 'entityName' || rule.fullField == 'businessLicenseNumber(营业执照编号)') return
                    this.save({attrCode:rule.fullField,attrValue:value}).then(res => {
                        this.getCompanyInfo()
                    })
                }
                
            };
        return {
            data:'',
            ruleInline: {
                    entityName: [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    "businessLicenseNumber(营业执照编号)": [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    "legalPersonName(法人姓名)": [
                         { validator: validateUserName, trigger: 'blur' }
                    ],
                    "corporateIdNumber(法人身份证号)": [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    "companyBankAccount(企业银行账号)": [
                        { validator: validateUserName, trigger: 'blur' }
                    ]
                },
        }
    },
    created() {
        this.init()
    },
    methods: {
        ...mapActions(['getCompanyInfo']),
        @track.loading
        async init(){
            let companyInfo = localStorages.get('companyInfo') ? JSON.parse(localStorages.get('companyInfo')) : {}
                let data = {}
                    data.entityName = companyInfo.entityName
                let keys =  ['businessLicenseNumber(营业执照编号)','theElectronicSignature(企业营业执照)','legalPersonName(法人姓名)','corporateIdNumber(法人身份证号)','companyBankAccount(企业银行账号)']
                let tempData = companyInfo.userEntityAttrDTOList.filter((item,index,ary) => {
                        return keys.includes(item.attrCode) ? true : false
                    })


                    for (const el of tempData) {

                        data[el['attrCode']] = el['attrValue']

                    }
                    
                    this.data = data
        },
        @track.loading
        async save(op){
            await updataCompanyInfo(op)
        },
        changeUrl(op){
            this.data[op.name] = op.url
            this.save({attrCode:op.name,attrValue:op.url}).then(res => {
                        this.getCompanyInfo()
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