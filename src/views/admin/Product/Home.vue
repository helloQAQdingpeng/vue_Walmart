<template>
    <div>
        <div>
            <el-row class="row">
                <router-link to="/admin/product/increase">
                <el-button type="success">新增</el-button>
                </router-link>
                <el-button type="success" style="margin:0px 20px;background-color: red;border: red;"  @click="derive">导出</el-button>
                <el-button type="success" style="margin:0px 20px;background-color: red;border: red;"  @click="batches">删除</el-button>
                <span style="color: darkgray;font-size: 14px;">
                    共有<span>{{pagination.total}}</span>数据
                </span>
            </el-row>

            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="商品名称">
                    <el-input v-model="formInline.name" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="formInline.checked_id" placeholder="商品分类">
                        <el-option v-for="item in category" :label="item.name" :value="item.id"></el-option>

                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </div>


        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" id="exportTab">

            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column label="编号">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column label="所属分类">
                <template slot-scope="scope">
                    <span>{{ scope.row.Category.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.image" alt="" style="width: 50px;height: 30px;">
                </template>
            </el-table-column>

            <el-table-column label="商品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="价钱">
                <template slot-scope="scope">
                    <span>{{ scope.row.price }}元</span>
                </template>
            </el-table-column>

            <el-table-column label="介绍">
                <template slot-scope="scope">
                    <span>{{ scope.row.body}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>


        <el-pagination
                background
                layout="prev, pager, next"
                @current-change="currentChange"
                :page-size="pagination.pageSize"
                :total="pagination.total">
        </el-pagination>
    </div>
</template>
<style>
    .has-gutter th div.cell {
        text-align: left;
    }
    .is-background{
        margin: 20px 0;
    }
    .row{
        float: left;
    }
    .demo-form-inline{
        float: right;
        margin-right: 50px;
    }

</style>
<script>
　　import FileSaver from 'file-saver'
　  import XLSX from 'xlsx'


    export default {
        data() {
            return {
                tableData: [],
                pagination:{
                    pageSize:0,
                    currentPage:1,
                    total:0,
                },
                multipleSelection: [],
                formInline: {
                    name: '',
                    checked_id: ''
                },
                category:[]
            }
        },
        created() {
            this.init()
        },

        methods: {
            //首页请求
            init() {
                this.axios.get(`http://localhost:3000/admin/Product?currentPage=${this.pagination.currentPage}&category=${this.formInline.checked_id}&keyword=${this.formInline.name}`).then(res => {
                    this.tableData = res.data.Products;
                    this.pagination = {
                        pageSize : res.data.pagination.pageSize,
                        currentPage:res.data.pagination.current,
                        total:res.data.pagination.total,
                    }
                });
                this.axios.get(`http://localhost:3000/admin/category`).then(res => {
                    this.category = res.data.categories
                })
            },
            //全选多选，批量删除
            handleSelectionChange(val) {
                this.multipleSelection = val.map(item=>{
                    return item.id
                })
            },
            batches(){
                this.axios.post(`http://localhost:3000/admin/Product/delete_checked`,{checked_id:this.multipleSelection}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init();
                })
            },
            handleEdit(index, row) {
                this.$router.push({name:'compile',params:{id:row.id}})
            },
            currentChange(val){
                this.pagination.currentPage = val;
                this.init();
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.axios.delete(`http://localhost:3000/admin/Product/${row.id}`).then(res=>{
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.init()
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            onSubmit() {
                    this.init()
            },
            //导出表格
            derive(){
                /* generate workbook object from table */
                var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
                var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '审核情况表.xlsx')
                        } catch (e) {
                     if (typeof console !== 'undefined') {
                            console.log(e, wbout)
                         }}
                    return wbout},
        }
    }
</script>