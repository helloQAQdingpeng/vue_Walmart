<template>
    <div class="container">
        <el-form ref="form" :model="form" label-width="80px" class="login-page" >
            <h2>沃尔玛后台登录页面</h2>
            <el-form-item label="用  户:" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名">
                    <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="密 码:">
                <el-input v-model="form.password" type="password" placeholder="请输入密码">
                    <el-button slot="prepend" icon="el-icon-key"></el-button>
                </el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-user-solid" @click="login">登 录</el-button>
            <el-button type="primary" icon="el-icon-user-solid" @click="registered">注 册</el-button>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    username: "",
                    password: ""
                }
            };
        },
        methods: {
            login(){
                this.axios.post(`http://localhost:3000/admin/users/login`,this.form).then(res=>{
                    console.log(res)
                    if(res.status == 200) { //如果成功了
                        //本地存储语法：
                        localStorage.token_type = res.data.token  //存入localStorage
                        this.$message({
                            message: '登录成功',
                            type: 'success'
                        });
                        this.$router.push({name:'/admin'})
                    }
                })
            },
            registered(){
                    this.$router.push({name:'registered'})
            }
        }
    }
</script>
<style scoped>
    .container {
        margin-top: 200px;
        width: 100%;
        height: 100%;
    }
    .login-page {
        border-radius: 5px;
        margin: auto;
        width: 350px;
        padding: 35px 55px 15px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
 .el-button--primary{
     margin: 0 41px;
 }
</style>