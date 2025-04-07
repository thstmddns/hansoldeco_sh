<script setup>
import Desktop from '../views/Index/Desktop.vue';
import Mobile from '../views/Index/Mobile.vue';

</script>
<template>
  <Desktop v-if="$device.isDesktop" />
  <Mobile v-else />
</template>