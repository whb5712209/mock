<template>
    <el-row class="home-box" :gutter="20">
        <el-col :span="4" class="home-left-box">
            <el-col :span="24" class="home-col">
                <el-menu
                    default-active="2"
                    class="home-el-menu el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item index="0">
                        <nuxt-link to="/home/list" class="link" slot="title">
                            <i class="el-icon-location"></i>
                            <span>接口列表</span>
                        </nuxt-link>
                    </el-menu-item>
                    <el-menu-item index="1">
                        <nuxt-link to="/home/edit" class="link" slot="title">
                            <i class="el-icon-setting"></i>
                            <span>创建接口</span>
                        </nuxt-link>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-col>
        <el-col :span="20" class="home-right-box">
            <div class="grid-content bg-purple-light">
                <nuxt-child/>
            </div>
        </el-col>
    </el-row>
</template>

<script>

export default {
  components: {
  }
}
</script>

<style>
.home-box{
    position: relative;
    height: 100%;
}
.link{
    color: inherit;
    text-decoration: none;
    display: block;
}
.home-right-box,.home-left-box,.home-el-menu,.home-col{
    position: relative;
    height: 100%;
}
</style>
