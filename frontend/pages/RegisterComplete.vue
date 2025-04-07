<script setup>
import Desktop from '../views/RegisterComplete/Desktop.vue';
import Mobile from '../views/RegisterComplete/Mobile.vue';
import { useQRStore } from '../stores/qr';

const qrStore = useQRStore();

const { qr } = storeToRefs(qrStore);

const router = useRouter();

const handleClickHome = () => {
  router.push('/');
};

const handleClickReportList = () => {
  router.push(`/reportlist?qr=` + qr.value.id);
};

</script>
<template>
  <Desktop v-if="$device.isDesktop"
    @handleClickHome="handleClickHome"
    @handleClickReportList="handleClickReportList"
  />
  <Mobile v-else 
    @handleClickHome="handleClickHome"
    @handleClickReportList="handleClickReportList"
  />
</template>