<template>
        <div>
            <el-row>
                <el-button type="success"  @click="dialogFormVisible = true">新增</el-button>
                <el-button type="success"  @click="batches">删除</el-button>
            </el-row>

            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column label="Id">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" style=" width: 20%;" @change="changeEvent(scope.row)"></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="分类">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.updatedAt | formatDate}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <!--//新增模态框-->
            <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
                <el-form :model="form">

                    <el-form-item label="分类名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth">
                        <el-input-number v-model="form.sort" @change="handleChange" :min="1" :max="99" label="描述文字"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="increase">确 定</el-button>
                </div>
            </el-dialog>
            <!--//新增模态框-->

            <!--//编辑模态框-->
            <el-dialog title="收货地址" :visible.sync="dialogFormVisibleTwo">
                <el-form :model="compile" :rules="rules">

                    <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="compile.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
                        <el-input-number v-model="compile.sort" @change="handleChange" :min="1" :max="99" label="描述文字"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleTwo = false">取 消</el-button>
                    <el-button type="primary" @click="redact(compile.id)">确 定</el-button>
                </div>
            </el-dialog>
            <!--//编辑模态框-->
        </div>
</template>
<style>
    .has-gutter th div.cell {
         text-align: left;
    }
</style>
<script>

    export default {
        data() {
            return {
                rules:{
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' },
                        { type: 'number', message: '排序必须是数字' ,trigger: 'blur'}
                    ],
                },
                tableData: [],
                dialogFormVisible: false,
                dialogFormVisibleTwo:false,
                form: {
                    name: '',
                    sort:''
                },
                compile: {},
                formLabelWidth: '120px',
                multipleSelection: []
            }
        },
        created() {
            this.init()
        },

        //过滤字符只显示前10位
        filters: {
                    formatDate(value) {
                     if (!value) return ''
                    if (value.length > 10) {
                    return value.slice(0,10)
                         }
                    return value
                    }
        },
      
        methods: {
            //首页请求
            init() {
                this.axios.get(`http://localhost:3000/admin/Category`).then(res => {
                    this.tableData = res.data.categories;
                })
            },
            //编辑请求单条
            handleEdit(index, row) {
                let id = row.id;
                this.dialogFormVisibleTwo = true;
                this.axios.get(`http://localhost:3000/admin/Category/${id}`).then(res=>{
                    this.compile = res.data.Category;
                    console.log(res.data.Category.sort)
                })
            },
            //表单排序
            changeEvent(val){
                var num=parseInt(val.sort);//input输入框字符串转数字
                var id = val.id
                this.form.sort = num;
                this.form.name = val.name;
                this.axios.put(`http://localhost:3000/admin/Category/${id}`,this.form).then(res=>{
                    this.init()
                })
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = row.id
                    this.axios.delete(`http://localhost:3000/admin/Category/${id}`).then(res=>{
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
            //新增
            increase(){
                this.axios.post(`http://localhost:3000/admin/Category`,this.form).then(res=>{
                    this.init()
                    this.dialogFormVisible = false;
                })
            },
            handleChange(value) {
            },
            // 编辑
            redact(val){
                this.axios.put(`http://localhost:3000/admin/Category/${val}`,this.compile).then(res=>{
                    this.dialogFormVisibleTwo = false;
                    this.init()
                })
            },
            //全选多选，批量删除
            handleSelectionChange(val) {
                this.multipleSelection = val.map(item=>{
                    return item.id
                });

            },
            batches(){
                this.axios.post(`http://localhost:3000/admin/Category/delete_checked`,{checked_id:this.multipleSelection}).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init();
                })
            }

        }
    }
</script>