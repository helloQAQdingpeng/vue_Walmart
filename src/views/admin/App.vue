<template>
    <div id="main" style="height: 100%">
        <el-container>
            <el-header   v-show="!(path ==='/admin/attestation/logon') && !(path ==='/admin/attestation/registered') ">
                <AdminHeader></AdminHeader>
            </el-header>
            <el-container>
                <el-aside width="200px" v-show="!(path ==='/admin/attestation/logon') && !(path ==='/admin/attestation/registered')">
                    <Aside></Aside>
                </el-aside>
                <el-main class="animate_fix">        <!--添加动画效果-->
                    <transition name="fade">
                        <router-view/>
                    </transition>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Aside from '../../components/shared/Aside.vue'
    import AdminHeader from '../../components/shared/Header.vue'

    export default {
        name: 'App',
        components: {
            Aside,
            AdminHeader
        },
        data() {
            return {
                path:''
            }
        },
        mounted() {
            this.path = this.$route.path;
            // console.log(this.$route.path)
        },
        watch: {
            $route(to, from) {
                this.path = to.path
            }
        }
    }
</script>

<style>
    body{
        height: 100%;
        margin: 0 auto;
    }
    .el-header {
        text-align: center;
        line-height: 60px;
        background-color: rgb(84, 92, 100);
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        background-color: #fff;
    }

    .el-menu {
        border: none;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        padding: 0;
    }

    html, body {
        height: 100%;
    }

    body > .el-container {
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .el-aside {
        height: 100%;
        background-color: rgb(84, 92, 100)
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .el-aside::-webkit-scrollbar {
        display: none;
    }

    .has-gutter th div.cell {
        text-align: center;
    }

    .animate_fix {
        position: relative;
        /*width: 100%;*/
    }

    .animate_fix > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
    }

    .el-card__body {
        padding: 5px;
    }

    .el-collapse-item:last-child {
        margin: 0;
    }

    .el-collapse-item__header {
        height: 38px;
        line-height: 38px;
    }

    .el-collapse-item__arrow {
        line-height: 38px;
        height: 38px;
    }

    .el-footer {
        margin-top: 30px;
        text-align: center;
    }

</style>