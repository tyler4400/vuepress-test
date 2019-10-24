<template>
    <div>
        我是测试组件:{{value}}
        <input v-model="myInput" type="text">
        <button @click="doSomething">点我</button>
        <div v-for="(item, key) in value">
            <h2>{{item}}{{key}}</h2>
            {{myInput}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MyTest.vue',
        props:{
            value: null
        },
        data () {
            return{
                myInput: null
            }
        },
        methods:{
            doSomething () {
                alert(this.myInput)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
