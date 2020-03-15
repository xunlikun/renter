<template>
    <div>
        <template v-if="token && userInfo.userStatus == 0">
            <Temp></Temp>
        </template>
        <template v-else-if="token">
            <div class='filter'>
                <Form ref="op" :model="op" :rules="ruleCustom" :label-width="80" inline>
                <FormItem label="项目编号" prop="projectCode">
                    <Input size="small" type="text" v-model="op.projectCode"></Input>
                </FormItem>
                <FormItem label="项目名称" prop="projectName">
                    <Input size="small" type="text" v-model="op.projectName"></Input>
                </FormItem>
                <FormItem label="项目经理" prop="projectManager">
                    <Input size="small" type="text" v-model="op.projectManager"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="op.projectStatus">
                        <Option value="1">完成</Option>
                        <Option value="0">在建</Option>
                    </Select>
                </FormItem>
                <FormItem label="创建日期">
                    <Row>
                        <Col span="11">
                            <DatePicker type="date" placeholder="开始日期" @on-change='(format)=>{op.startTimeMin = format.replace(/-/ig,"/")}'></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <DatePicker type="date" placeholder="结束日期" @on-change='(format)=>{op.startTimeMax = format.replace(/-/ig,"/")}'></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="完工日期">
                    <Row>
                        <Col span="11">
                            <DatePicker type="date" placeholder="开始日期" @on-change='(format)=>{op.finishTimeMin = format.replace(/-/ig,"/")}'></DatePicker>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <DatePicker type="date" placeholder="结束日期" @on-change='(format)=>{op.finishTimeMax = format.replace(/-/ig,"/")}'></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('op')">检索</Button>
                    <Button type="primary" @click='changeModal_employee_add'>新增</Button>
                </FormItem>
            </Form>
            </div>
            <Table :data="projectData" :columns="tableColumns" :style='{minHeight:"500px"}' stripe></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="current" @on-change="changePage"></Page>
                </div>
            </div>
        </template>
        <Modal
            title="新增"
            v-model="modal_employee_add"
            class-name="vertical-center-modal"
            @on-ok="handleSubmitNew('formInline')"
            ok-text="新增">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="projectCode" label="工程编号">
                        <Input type="text" v-model="formInline.projectCode" placeholder="工程编号">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="projectName" label="工程名称">
                        <Input type="text" v-model="formInline.projectName" placeholder="工程名称">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="bankAccount" label="银行账户">
                        <Input type="text" v-model="formInline.bankAccount" placeholder="银行账户">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="projectStatus" label="工程状态">
                        <Select v-model="formInline.projectStatus">
                            <Option value="0">在建</Option>
                            <Option value="1">完工</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="projectManagerCode" label="项目经理">
                         <Select
                            v-model="formInline.projectManagerCode"
                            filterable
                            remote
                            :remote-method="remoteMethod1"
                            :loading="loading1">
                            <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.userName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="projectAccountantCode" label="项目财务">
                         <Select
                            v-model="formInline.projectAccountantCode"
                            filterable
                            remote
                            :remote-method="remoteMethod1"
                            :loading="loading1">
                            <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.userName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="startTime" label="开工日期">
                        <DatePicker type="datetime" placeholder="Select date and time" @on-change='(format)=>{formInline.startTime = format}' style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="finishTime" label="完工日期">
                        <DatePicker type="datetime" placeholder="Select date and time" @on-change='(format)=>{formInline.finishTime = format}' style="width: 200px"></DatePicker>
                    </FormItem>
                </Form>
        </Modal>
    </div>
</template>
<script>
import track from '@/utils/track.js'
import Temp from '@/components/temp/waitingPeriod'
import { mapGetters, mapActions } from 'vuex'
import { saveProjectDetail,getEmployeeInfo } from '@/api/project.js'
export default {
    components:{Temp},
    data() {
        const validateText = (rule, value, callback) => {
                if (value == '' && !value) {
                    callback(new Error('请输入！'));
                } else {
                    callback();
                }
            };
        return {
            loading1:false,
            options1:[],
            modal_employee_add:false,
            op:{
                projectCode:'',
                projectName:'',
                projectManager:'',
                projectStatus:'',
                startTimeMin:'',
                startTimeMax:'',
                finishTimeMin:'',
                finishTimeMax:''
            },
            ruleCustom: {
                    contractCode: [
                        { validator: validateText}
                    ],
                    contractTitle: [
                        { validator: validateText}
                    ],
                    partyB: [
                        { validator: validateText}
                    ],
                    isSigned: [
                        { validator: validateText}
                    ],
                    createDateMin: [
                        { validator: validateText}
                    ],
                    createDateMax: [
                        { validator: validateText}
                    ],
                    signedTimeMin: [
                        { validator: validateText}
                    ],
                    signedTimeMax: [
                        { validator: validateText}
                    ]
                },
            formInline:{

            },
            ruleInline:{
                projectCode: [
                    { validator: validateText}
                ],
                projectName: [
                    { validator: validateText}
                ],
                bankAccount: [
                    { validator: validateText}
                ],
                projectStatus: [
                    { validator: validateText}
                ],
                projectManagerCode: [
                    { validator: validateText}
                ],
                projectAccountantCode: [
                    { validator: validateText}
                ]
            },
            total:100,
            current:1,
            projectData:[],
            tableColumns: [
                    {
                        title: '项目编号',
                        key: 'projectCode',
                        render:(h, params) => {
                            return h('a', {on:{
                                click: () => {
                                    this.gotoDetail({id:params.row.id})
                                }
                            }},params.row.projectCode);
                        }
                    },
                    {
                        title: '项目名称',
                        key: 'projectName'
                    },
                    {
                        title: '项目经理',
                        key: 'projectManager'
                    },
                    {
                        title: '状态',
                        key: 'projectStatus',
                        render: (h, params) => {
                            return h('div', {},params.row.projectStatus == 0 ? '在建' : '完工');
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'startTime'
                    },
                    {
                        title: '完工日期',
                        key: 'finishTime',
                        render: (h, params) => {
                            return h('div', {},params.row.projectStatus == 1 ? params.row.finishTime : '');
                        }
                    }
                ]
        }
    },
    created() {
        this.init()
    },
    computed: {
        ...mapGetters(['token','userInfo'])
    },
    methods: {
        ...mapActions(['getCompanyInfo','getProjectList']),
        log(formart){
            console.log(formart)
        },
        remoteMethod1(query){
                    this.loading1 = true;
                    getEmployeeInfo().then(res => {
                       
                       this.options1 = res.data
                       this.loading1 = false
                    })
                    
        },
        @track.loading
        changeModal_employee_add(){
            this.modal_employee_add = true
        },
        @track.loading
        async saveProjectDetail(){
            let status = (await saveProjectDetail(this.formInline)).status
                        if(status == 200){
                           this.$Message.success('成功!'); 
                           this.init()
                        }else{
                            this.$Message.error('服务器开小差去啦!');
                        }
        },
        async handleSubmitNew(name) {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {

                        
                        await this.saveProjectDetail()
                        
                    } else {

                        this.$Message.error('请补充信息!');
                    }
                })
            },
        @track.loading
        async init(){
            if(this.userInfo.userStatus == 0){
                this.getCompanyInfo()
            }else{
                this.getCompanyInfo()
                let query = JSON.parse(JSON.stringify(this.op))
                for (const key in query) {
                    if(query[key]){

                    }else{
                        delete query[key]
                    }
                }
                let data = (await this.getProjectList(query)).data
                    this.projectData = data.records
                    this.total = data.total
                    this.current = data.page
            }
        },
        @track.loading
        gotoDetail(query){
            this.$router.push({path:'/manager/project/projectDetail',query:query})
        },
        changePage (page) {
            this.op.current = page
            // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            this.init();
        },
        handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.init()
                    } else {
                        this.$Message.error('失败!');
                    }
                })
        }
    },
    watch: {
        formInline:{
            deep:true,
            handler(){
                if(this.formInline.projectManagerCode){
                    this.formInline.projectManager = this.options1.filter((item,index,ary) =>{
                    return item.id == this.formInline.projectManagerCode
                    })[0].userName
                }
                
                if(this.formInline.projectAccountantCode){
                    this.formInline.projectAccountant = this.options1.filter((item,index,ary) =>{
                    return item.id == this.formInline.projectAccountantCode
                    })[0].userName
                }
                

                console.log(this.formInline)
            }
        }
    },
}
</script>