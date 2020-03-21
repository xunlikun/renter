<template>
<div>
    <div class='filter'>
        <Form ref="op" :model="op" :rules="ruleCustom" :label-width="80" inline>
            <FormItem label="合同类型" prop="contractType">
                <Select v-model="op.contractType">
                    <Option value="constructor">框架合同</Option>
                    <Option value="project">租赁合同</Option>
                    <Option value="lease">个人合同</Option>
                </Select>
            </FormItem>
            <FormItem label="合同编号" prop="contractCode">
                <Input size="small" type="text" v-model="op.contractCode"></Input>
            </FormItem>
            <FormItem label="合同标题" prop="contractTitle">
                <Input size="small" type="text" v-model="op.contractTitle"></Input>
            </FormItem>
            <FormItem label="对方" prop="partyB">
                <Input size="small" type="text" v-model="op.partyB"></Input>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="op.isSigned">
                    <Option value="1">已签订</Option>
                    <Option value="0">待签订</Option>
                </Select>
            </FormItem>
            <FormItem label="创建日期">
                <Row>
                    <Col span="11">
                        <DatePicker type="date" placeholder="开始日期" @on-change='(format)=>{op.createDateMin = format.replace(/-/ig,"/")}'></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <DatePicker type="date" placeholder="结束日期" @on-change='(format)=>{op.createDateMax = format.replace(/-/ig,"/")}'></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="签署日期">
                <Row>
                    <Col span="11">
                        <DatePicker type="date" placeholder="开始日期" @on-change='(format)=>{op.signedTimeMin = format.replace(/-/ig,"/")}'></DatePicker>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                        <DatePicker type="date" placeholder="结束日期" @on-change='(format)=>{op.signedTimeMax = format.replace(/-/ig,"/")}'></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('op')">检索</Button>
            </FormItem>
        </Form>
    </div>
    <div class='multiple_asing'>
        <Button type="success" @click='confirm'>批量签约</Button>
        <Button style='float:right;margin-right:26px' type="success" @click='modal2 = true'>上传合同</Button>
        <Button style='float:right;margin-right:26px' type="success" @click='downLoad("/api/renter/contract/download")'>合同模板下载</Button>
    </div>
    <Table @on-selection-change='selection' :data="contractData" :columns="tableColumns" :style='{minHeight:"500px"}' stripe></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="total" :current="current" @on-change="changePage"></Page>
        </div>
    </div>
    <Modal
        v-model="modal1"
        title="验证您的信息"
        @on-ok='sign'
        >
        <Form ref="formInline" :model="formInline">
            <Row>
                <Col span="12">
                    <FormItem prop="verificationCode" >
                        <Input type="text" v-model="formInline.verificationCode" placeholder="验证码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                </Col>
                <Col span="12"><Button :style='{float:"right"}' type="primary" :disabled='sendingAuth' @click=" !sendingAuth && sendSignMobileCode()">{{sendingAuth ? mis :'获取验证码'}}</Button></Col>
            </Row>
        </Form>
    </Modal>
    <Modal v-model="modal2">
        <p slot="header">
            <span>合同上传</span>
        </p>
        <div style="text-align:center">
        <div style="text-align:left;margin: 16px 0 26px 0">
            <span>请先选择合同类型:</span>
            <Select v-model="uploadType" style="width:200px">
                <Option value="constructor_company" key="constructor_company">框架合同</Option>
                <Option value="project" key="project">租赁合同</Option>
            </Select>
        </div>
            <Upload
                :headers={authorization:token}
                :data={templateType:uploadType}
                name='contract'
                type="drag"
                action="api/renter/contract/upload"
                show-upload-list
                accept='xlsx,xls'
                :format="['xlsx','xls']"
                :on-success='success'
                :on-error='error'
                :on-format-error='formatError'
                :before-upload='beforeUpload'
                >
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击上传或拖拽文件入内</p>
                </div>
                </Upload>
        </div>
        <div slot="footer">
            
        </div>
    </Modal>
</div>
</template>
<script>
        // @on-ok="ok"
        // @on-cancel="cancel"
import track from '@/utils/track.js'
import { mapActions } from 'vuex'
import { sign } from '@/api/contract.js'
import { sendSignMobileCode } from '@/api/user.js'
import { downLoad } from '@/utils/sma.js'
import { mapGetters } from 'vuex'
export default {
    data() {
        const validateText = (rule, value, callback) => {
                // if (value == '' || !value) {
                //     callback(new Error('请输入！'));
                // } else {
                    callback();
                // }
            };
        return {
            uploadType:'',
            downLoad:downLoad,
            modal1:false,
            modal2:false,
            formInline:{},
            sendingAuth:false,
            mis:5,
            op: {
                    contractCode:'',
                    contractTitle:'',
                    partyB:'',
                    isSigned:'',
                    createDateMin:'',
                    createDateMax:'',
                    signedTimeMin:'',
                    signedTimeMax:''
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
            total:100,
            current:1,
            contractData:[],
            currentSelections:[],
                tableColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '合同编号',
                        key: 'contractCode',
                        render:(h, params) => {
                            return h('a', {on:{
                                click: () => {
                                    this.gotoDetail({contractType:params.row.contractType,id:params.row.id})
                                }
                            }},params.row.contractCode);
                        }
                    },
                    {
                        title: '合同标题',
                        key: 'contractTitle'
                    },
                    {
                        title: '我方',
                        key: 'partyA'
                    },
                    {
                        title: '对方',
                        key: 'partyB'
                    },
                    {
                        title: '状态',
                        key: 'contractStatus',
                        render: (h, params) => {
                            return h('div', {},params.row.isSigned ? '已签订' : '待签订');
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'createDate'
                    },
                    {
                        title: '签订日期',
                        key: 'signedTime',
                        render: (h, params) => {
                            return h('div', {},params.row.isSigned ? params.row.signedTime.slice(0,19).replace('T',' ') : '');
                        }
                    },
                    {
                        title: '操作',
                        key: 'calculate',
                        render: (h, params) => {
                            if(!params.row.isSigned){
                                return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        // click: () => {
                                        //     this.down(params.row.contractPath)
                                        // }
                                    }
                                },  [h('a',{
                                        attrs:{href:params.row.contractPath,target:'_blank'},
                                        style:{
                                            display:'inline-block',
                                            width:'100%',
                                            height:'24px',
                                            color: '#fff'
                                        }},'下载')]),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.checkSign(params.row)
                                        }
                                    }
                                }, '签约')
                            ]);
                            }else{
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            // click: () => {
                                            //     this.down(params.row.contractPath)
                                            // }
                                        }
                                    },  [h('a',{
                                        attrs:{href:params.row.contractPath,target:'_blank'},
                                        style:{
                                            display:'inline-block',
                                            width:'100%',
                                            height:'24px',
                                            color: '#fff'
                                        }},'下载')])
                                ]);
                            }
                            
                        }
 
                    }
                ]
        }
    },
    created() {
        this.init()
    },
    computed: {
        ...mapGetters(['token'])
    },
    methods: {
        ...mapActions(['getContractList','down']),
        beforeUpload(){
            if(!this.uploadType){
                return false
            }
        },
        success(response, file, fileList){
            this.init()
        },
        error(error, file, fileList){
            
        },
        formatError(file, fileList){

        },
        sendSignMobileCode(data){
                sendSignMobileCode().then(res => {
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
                        this.$Message.error('错误!');
                    }
                })
        },
        checkSign(op){
            this.modal1 = true
            this.currentSelections.push(op)
        },
        @track.loading
        sign(){
            let signListCode = []
            for(let op of this.currentSelections){
                signListCode.push(op.id)
            }
            console.log(signListCode)
            sign({contractType:this.currentSelections[0].contractType,verificationCode:this.formInline.verificationCode,ids:signListCode}).then( res => {
                console.log(res)
                this.currentSelections = []
                this.init()
            } )
        },
        @track.loading
        async init(){
            let query = JSON.parse(JSON.stringify(this.op))
            for (const key in query) {
                if(query[key]){

                }else{
                    delete query[key]
                }
            }

          let data = (await this.getContractList(query)).data
          this.contractData = data.records
          this.total = data.total
          this.current = data.page
          this.currentSelections = []
        },
        @track.loading
        gotoDetail(query){
            this.$router.push({path:'/manager/contract/contractDetail',query:query})
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
        },
        selection(selections){
            this.currentSelections = selections.filter((item,index,ary) => {
                return !item.isSigned
            })
        },
        confirm () {
                this.$Modal.confirm({
                    title: '签约',
                    content: '<p>您将要执行批量签订？</p>',
                    onOk: () => {
                        if(this.currentSelections.length == 0){
                            return this.$Message.warning('请先选择！');
                        }
                        this.modal1 = true
                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });
            }
    },
}
</script>
<style scoped>
    .multiple_asing{
        padding: 0 0 10px 10px;
    }
</style>
