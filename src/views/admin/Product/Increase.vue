<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>xxxxx</el-breadcrumb-item>
        <el-breadcrumb-item>xxxxx</el-breadcrumb-item>
        <el-breadcrumb-item>xxxxx</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="region">
            <el-select v-model="ruleForm.categoryId" placeholder="请选择活动区域">

                <el-option v-for="item in tableData" :label="item.name" :value="item.id"></el-option>

            </el-select>
        </el-form-item>

        <el-form-item label="库存">
        <el-input-number v-model="ruleForm.stock" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>

        <el-form-item label="单价" prop="price">
        <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>


        <!--七牛云的上传地址，根据自己所在地区选择，我这里是华东区-->
        <!--查看地址：https://developer.qiniu.com/kodo/manual/1671/region-endpoint-->
        <el-form-item label="缩略图" prop="image">
            <el-upload
                    class="avatar-uploader"
                    :data="qiniuForm"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    action="http://upload-z2.qiniup.com"
            >
                <img v-if="ruleForm.image" :src="ruleForm.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>

        <el-form-item label="商品描述" prop="body">
            <el-input type="textarea" v-model="ruleForm.body"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>

</div>
</template>

<style>
    .el-breadcrumb{
        margin-bottom: 20px;
    }
    .el-input__inner , .el-textarea__inner{
        width: 80%;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<script>


    const uuidV1 = require('uuid/v1');

    export default {
        data() {
            return {
                qiniuForm: {
                    key: '', //文件名称
                    token: ''
                },
                tableData:[],
                ruleForm: {
                    name: '',
                    categoryId: '',
                    body: '',
                    stock:'',
                    price:'',
                    image:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    categoryId: [
                        { required: true, message: '请选择商品分类', trigger: 'change' }
                    ],
                    body: [
                        { required: true, message: '请填写商品描述', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '请输入商品单价', trigger: 'blur' }
                    ]
                }
            };
        },
        created(){
            this.axios.get(`http://localhost:3000/admin/Category`).then(res => {
                console.log(res)
                this.tableData = res.data.categories;
            })
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post(`http://localhost:3000/admin/Product`,this.ruleForm).then(res=>{
                            this.$router.push('/admin/product')
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            });
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleChange(value) {
                console.log(value);
            },

            //上传之前
            async beforeUpload(file) {
                console.log(file)
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
                }

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!')
                }

                //如果验证失败，返回假
                if(isJPG && isLt2M == false) return false;

                //如果验证成功，获取token
                let fileType = file.type == 'image/jpeg' ? 'jpg' : 'png'; //获取扩展名
                console.log(fileType)
                let res = await this.axios.get('http://localhost:3000/admin/photo/uploadToken')
                // console.log(res);return;
                this.qiniuForm = {
                    key: `${uuidV1()}.${fileType}`, //文件名称
                    token: res.data.data.token
                }
                console.log(this.qiniuForm)
                return true;
            },

            //上传成功，获取图片地址
            uploadSuccess(res, file) {
                console.log(res,file)
                this.ruleForm.image = 'http://pxntzg805.bkt.clouddn.com/' + res.key
            },
        }
    }
</script>



