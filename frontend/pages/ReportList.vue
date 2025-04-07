<script setup>
import Desktop from '../views/ReportList/Desktop.vue';
import Mobile from '../views/ReportList/Mobile.vue';
import { reactive, onMounted } from "vue";
import { getReportListByQR, getReports } from "~/api/report";
import { useModalStore } from "~/stores/modal";
import { useReportStore } from "~/stores/report";
import { useImageEditStore } from "~/stores/image_edit";
import { getQRById, getQRList } from '~/api/qr';
import JSZip from 'jszip';

const { isDesktop } = useDevice();

const router = useRouter();

const qrStore = useQRStore();
const reportStore = useReportStore();
const imageEditStore = useImageEditStore();

const { report_list } = storeToRefs(reportStore);

const { setQr } = qrStore;
const { setReportList } = reportStore;

const state = reactive({
  showReportImageIndex: {},
});

const { setImageViewModal, setImageViewSource, setImageEditModal } = useModalStore();
const { setImageEditSource } = imageEditStore;

const handleClickAddReport = async () => {
  const qrID = router.currentRoute.value.query.qr;

  const { data: { data } } = await getQRById(qrID);
  setQr(data);

  router.push('/defect');
}

const handleClickDeleteReport = async (id) => {
  const qrID = router.currentRoute.value.query.qr;

  await deleteReport(id).catch((err) => {
    console.error(err);
  });

  const { data: { data } } = await getReportListByQR(qrID).catch((err) => {
    console.error(err);
  });

  setReportList(data);
}

const handleClickDownLoadDefectList = () => {
  const defectList = report_list.value.map((report) => {
    return report.attributes.defects.data.map((defect) => {
      return {
        report_name: report.attributes.description,
        id: defect.id,
        file_name: defect.attributes.file_name,
        origin_image_url: defect.attributes.origin_image_url,
        bounding_box_image_url: defect.attributes.bounding_box_image_url,
      }
    });
  }).flat();
  
  // download zip file that contains defect list image files
  const zip = new JSZip();
  const folder = zip.folder('defect_list');

  defectList.forEach((defect, index) => {
    const { report_name, id, file_name, origin_image_url, bounding_box_image_url } = defect;

    // const originImageBlob = fetch(origin_image_url + '?pass').then((res) => res.blob());
    const boundingBoxImageBlob = fetch(bounding_box_image_url + '?pass').then((res) => res.blob());

    // folder.file(`${id}_${file_name}`, originImageBlob);
    folder.file(`${report_name}_${id}_${file_name}`, boundingBoxImageBlob);
    
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = 'defect_list.zip';
    a.click();
  });

}

const handleClickedReport = (index, imageLength) => {
  state.showReportImageIndex[index] = !state.showReportImageIndex[index];

  if (imageLength === 0) alert('하자 이미지가 없습니다.');
};

const handleClickImage = (id, file_name, origin_image_url, bounding_box_image_url, bounding_box_json) => {
  // setImageViewSource(image);
  // setImageViewModal(true);

  setImageEditSource({ id, file_name, origin_image_url, bounding_box_image_url, bounding_box_json });

  // if desktop, open image edit modal
  if (isDesktop) setImageEditModal(true);
  if (!isDesktop) router.push({ name: 'ImageEdit', params: { id } });
};

onMounted(async () => {
  const qrID = router.currentRoute.value.query.qr;

  const { data: { data } } = await getReportListByQR(qrID).catch((err) => {
    console.error(err);
  });

  // descending order by createdAt
  const reportList = data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));

  setReportList(reportList);
})

</script>
<template>
  <Desktop v-if="$device.isDesktop" 
    :reportList="report_list"
    :showReportImageIndex="state.showReportImageIndex"
    @handleClickDownLoadDefectList="handleClickDownLoadDefectList"
    @handleClickAddReport="handleClickAddReport"
    @handleClickedReport="handleClickedReport"
    @handleClickImage="handleClickImage"
  />
  <Mobile v-else 
    :reportList="report_list"
    :showReportImageIndex="state.showReportImageIndex"
    @handleClickDownLoadDefectList="handleClickDownLoadDefectList"
    @handleClickAddReport="handleClickAddReport"
    @handleClickedReport="handleClickedReport"
    @handleClickImage="handleClickImage"
  />
</template>