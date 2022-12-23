<script setup>
import { computed, ref, watchEffect } from 'vue';
const props = defineProps({
    thread: Array
})

</script>

<template>
    <div>
        <p v-for="tweet of thread">
            {{ tweet.data.text }}
        </p>
    </div>
</template>

<style scoped>
</style>
