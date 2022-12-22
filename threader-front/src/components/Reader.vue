<script setup>
import { computed, ref, watchEffect } from 'vue';
const props = defineProps({
    thread: Object
})

let type = computed(() => props.thread.type)

watchEffect(() => {
    console.log('reader', props.thread);
})

</script>

<template>
    <div v-if="type == 'success'">
        <p v-for="tweet of thread.data">
            {{ tweet.text }}
        </p>
    </div>
    <div v-else-if="type == 'empty'">empty</div>
    <div v-else-if="type == 'error'">error</div>
</template>

<style scoped>
</style>
