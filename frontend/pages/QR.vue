<script setup>
import Desktop from '../views/QR/Desktop.vue';
import Mobile from '../views/QR/Mobile.vue';
import { reactive } from "vue";
import QRCode from 'qrcode';
import { postQR } from "~/api/qr";
import { uploadImageByDataURI } from "../api/serverless";
import { useModalStore } from '../stores/modal';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const { user_id } = storeToRefs(userStore);

const { setLoadingModal } = useModalStore();

const router = useRouter();

const state = reactive({
  title: '',
  latitude: null,
  longitude: null,
  locationUrl: '',
  qrCode: null,
  isQRSaved: false,
});

const handleInputTitle = (e) => {
  state.title = e.target.value;
};

const handleClickCreateQR = (e) => {
  const title = encodeURIComponent(state.title);
  state.locationUrl = `https://www.google.com/maps?q=${state.latitude},${state.longitude}&title=${title}&mark=sosohaja`;
  
  QRCode.toDataURL(state.locationUrl, { width: 300 }, function (err, url) {
    if (err) throw err;

    state.qrCode = url;
  });
};

const handleClickSaveQR = async () => {
  setLoadingModal(true);

  const res = await uploadImageByDataURI(state.qrCode).catch((err) => {
    console.error(err);
  });

  await postQR({ title: state.title, location_url: state.locationUrl, code_image: res.data, creator: user_id.value })
    .then((res) => {
      state.isQRSaved = true;
    })
    .catch((err) => {
      console.error(err);
    })

  setLoadingModal(false);

}

const handleClickBack = () => {
  router.back();
}


const getLocationSuccess = (position) => {
  state.latitude = position.coords.latitude;
  state.longitude = position.coords.longitude;
}

const getLocationError = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError);
})


</script>
<template>
  <Desktop v-if="$device.isDesktop" 
    :title="state.title"
    :latitude="state.latitude"
    :longitude="state.longitude"
    :locationUrl="state.locationUrl"
    :qrCode="state.qrCode"
    :isQRSaved="state.isQRSaved"
    @handleInputTitle="handleInputTitle"
    @handleClickCreateQR="handleClickCreateQR"
    @handleClickSaveQR="handleClickSaveQR"
    @handleClickBack="handleClickBack"
  />
  <Mobile v-else 
    :title="state.title"
    :latitude="state.latitude"
    :longitude="state.longitude"
    :locationUrl="state.locationUrl"
    :qrCode="state.qrCode"
    :isQRSaved="state.isQRSaved"
    @handleInputTitle="handleInputTitle"
    @handleClickCreateQR="handleClickCreateQR"
    @handleClickSaveQR="handleClickSaveQR"
    @handleClickBack="handleClickBack"
  />
</template>