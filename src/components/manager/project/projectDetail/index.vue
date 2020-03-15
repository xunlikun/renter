<template>
    <div class='main' v-if="data">
         <List>
             <header>
                 <h1 style="line-height:50px;text-align:center;color:#2d8cf0;opacity:.6;">项目详情</h1>
             </header>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/bianhao.png')" title="项目编号" :description="data.projectCode" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/shebeimingcheng.png')" title="项目部名称" :description="data.projectName" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/chengshijinglixianxing.png')" title="项目经理" :description="data.projectManager" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/caiwubaobiao.png')" title="项目财务" :description="data.projectAccountant" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/changyongicon-.png')" title="银行账号" :description="data.bankAccount" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/fazhuangtai.png')" title="状态" :description="data.projectStatus == 0 ? '在建':'完工'" />
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/riqi.png')" title="创建日期" :description="data.createDate"/>
            </ListItem>
            <ListItem>
                <ListItemMeta :avatar="require('@/assets/images/list/riqi.png')" title="完工日期" :description="data.projectStatus == 0 ? '未完工' : data.finishTime"/>
            </ListItem>
        </List>
    </div>
</template>
<script>
import track from '@/utils/track.js'
import { getProjectDetail } from '@/api/project.js'
export default {
    data() {
        return {
            data:''
        }
    },
    created() {
        this.init()
    },
    methods: {
        @track.loading
        async init(){
            let query = JSON.parse(JSON.stringify(this.$route.query))
            for (const key in query) {
                if(query[key]){

                }else{
                    delete query[key]
                }
            }

            getProjectDetail(query).then( res => {
                if(res.status == 200){
                    this.data = res.data
                }
            })

        }
    },
} 
</script>
<style lang="scss" scoped>
    .main{
        width: 500px;
        margin: 0 auto;
        box-shadow: 0 0 10px 1px #eee;
    }
</style>