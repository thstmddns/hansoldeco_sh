<script setup>
import Desktop from '../views/Register/Desktop.vue';
import Mobile from '../views/Register/Mobile.vue';
import { storeToRefs } from "pinia";
import { useModalStore } from '../stores/modal';
import { useQRStore } from '../stores/qr';
import { useDefectStore } from '../stores/defect';
import { uploadImageByDataURI } from '../api/serverless';
import { postReports } from '../api/report';
import { postDefect } from '../api/defect';

const router = useRouter();

const modalStore = useModalStore();
const qrStore = useQRStore();
const defectStore = useDefectStore();

const { qr } = storeToRefs(qrStore);
const { file_list } = storeToRefs(defectStore);

const { setLoadingModal } = modalStore;
const { setFileList } = defectStore;

const state = reactive({
  description: '',
})

const handleInputDescription = (e) => {
  state.description = e.target.value;
}

const handleClickAddFile = () => {
  router.push('/defect');
}

const handleClickSave = async () => {
  setLoadingModal(true);

  const { data : { data }} = await postReports({ qr: qr.value.id, title: '', description: state.description }).catch((err) => console.error(err));


  file_list.value.forEach(async (file) => {
    const origin_image = await uploadImageByDataURI(file.origin_image, 'origin_' + file.filename).catch((err) => {
      console.error(err);
    });

    const bounding_box_image = await uploadImageByDataURI(file.bounding_box_image, file.filename).catch((err) => {
      console.error(err);
    });

    const isHasModify = file.bounding_box_array.some(item => item.klass === '수정');
    const isHasPollution = file.bounding_box_array.some(item => item.klass === '오염');
    const isHasDamage = file.bounding_box_array.some(item => item.klass === '손상');

    await postDefect({ report: data.id, qr: qr.value.id, file_name: file.filename, origin_image_url: origin_image.data, bounding_box_image_url: bounding_box_image.data, bounding_box_json: file.bounding_box_array, modify: isHasModify, pollution: isHasPollution, damage: isHasDamage})
      .then((res) => {
        (res);
      })
      .catch((err) => {
        console.error(err);
      });

  });

  setFileList([]);
  setLoadingModal(false);

  router.push('/registercomplete');

}

onMounted(() => {
  if (!qr.value?.id) {
    router.push('/');
  }
})


</script>
<template>
  <Desktop v-if="$device.isDesktop"
   :description="state.description"
   :file_list="file_list"
   @handleInputDescription="handleInputDescription"
   @handleClickAddFile="handleClickAddFile"
   @handleClickSave="handleClickSave"
  />
  <Mobile v-else 
    :file_list="file_list"
    :description="state.description"
    @handleInputDescription="handleInputDescription"
    @handleClickAddFile="handleClickAddFile"
    @handleClickSave="handleClickSave"
  />
</template>