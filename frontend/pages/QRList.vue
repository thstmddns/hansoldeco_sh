<script setup>
import { onMounted } from "vue";
import { getQRList } from "~/api/qr";
import Desktop from '../views/QRList/Desktop.vue';
import Mobile from '../views/QRList/Mobile.vue';
import { useModalStore } from "../stores/modal";
import { deleteQR } from "~/api/qr";

const modalStore = useModalStore();

const { setDeleteQrModal, setCallbackDeleteQr } = modalStore;

const router = useRouter();

const state = reactive({
  qrList: [],
  hoverdIndex: -1,
})

const handleClickDownLoadCSV = () => {
  const header = '장소,보고서 이름,하자 이름, 하자 생성일';

  const csv = state.qrList.map((qr) => {
    return qr.attributes.defects.data.map((defect) => {
      return `${qr.attributes.title},${defect.attributes.report.data.attributes.description},${defect.attributes.file_name},${defect.attributes.createdAt}`;
    }).join('\n');
  }).join('\n');

  const blob = new Blob(["\ufeff"+header+csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '하자 현황.csv';
  a.click();

}

const handleHoverUser = (index) => {
  state.hoverdIndex = index;
}

const handleLeaveUser = () => {
  state.hoverdIndex = -1;
}

const handleClickQR = (id) => {
  router.push(`/reportlist?qr=${id}`);
}

const handleClickDeleteQR = async (e, id) => {
  e.stopPropagation();

  setDeleteQrModal(true);

  setCallbackDeleteQr(async() => {
    await deleteQR(id).catch((err) => {
      console.error(err);
    });

    const { data: { data } } = await getQRList().catch((err) => {
      console.error(err);
    });

    state.qrList = data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));
  });
  
}

onMounted(async () => {
  const { data: { data } } = await getQRList().catch((err) => {
    console.error(err);
  });

  // descending order by createdAt
  state.qrList = data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));

})

</script>
<template>
  <Desktop v-if="$device.isDesktop" 
    :qrList="state.qrList"
    :hoverdIndex="state.hoverdIndex"
    @handleClickDownLoadCSV="handleClickDownLoadCSV"
    @handleHoverUser="handleHoverUser"
    @handleLeaveUser="handleLeaveUser"
    @handleClickQR="handleClickQR"
    @handleClickDeleteQR="handleClickDeleteQR"
  />
  <Mobile v-else 
    :qrList="state.qrList"
    :hoverdIndex="state.hoverdIndex"
    @handleClickDownLoadCSV="handleClickDownLoadCSV"
    @handleHoverUser="handleHoverUser"
    @handleLeaveUser="handleLeaveUser"
    @handleClickQR="handleClickQR"
    @handleClickDeleteQR="handleClickDeleteQR"
  />
</template>