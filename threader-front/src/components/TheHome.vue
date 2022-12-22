<script setup>
import { computed,ref,watchEffect } from 'vue';
import Reader from './Reader.vue'

let threadURL=ref(null)
let apiURL='http://localhost:3000/thread'
let threadData=ref({
    type: "empty"
})

watchEffect(() => {
    console.log('home',threadData.value);
})

async function read() {
    // let threadID = threadURL.value.split('/')[5]
    if(!isTweetUrl(threadURL.value)) {
        console.log('bad url');
        return
    }
    let threadID=threadURL.value.split('/')[5]
    const data=await fetch(`${apiURL}/${threadID}`)
    const response=await data.json()
    threadData.value=response
}

function isTweetUrl(string) {
    const tweetUrlRegex=/^https:\/\/twitter\.com\/\w+\/status\/\d+$/;
    return tweetUrlRegex.test(string);
}


</script>

<template>
    <input type="text" v-model="threadURL" />
    <button @click="read()">Read</button>
    <Reader :thread="threadData" />
</template>

<style scoped>
</style>
