<script setup>
import Desktop from '../views/DetectQR/Desktop.vue';
import Mobile from '../views/DetectQR/Mobile.vue';
import { useDefectStore } from '../stores/defect';
import { useQRStore } from '../stores/qr';
import { reactive } from 'vue';
import { getQRByTitle } from '~/api/qr';

const defectStore = useDefectStore();
const qrStore = useQRStore();

const { setLocationUrl, setFileList } = defectStore;
const { setQr } = qrStore;

const router = useRouter();

const state = reactive({
  isCapture: false,
});

const QRCapture = () => {
  const { BrowserQRCodeReader } = window.ZXing; // If using the CDN
  const videoElement = document.getElementById('qr-video');
  const codeReader = new BrowserQRCodeReader();
  
  // http에서는 보안 때문에 mediaDevices를 사용할 수 없다. chrome://flags/#unsafely-treat-insecure-origin-as-secure 에서 도메인 추가 후 브라우저 재시작
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(async function(stream) {
      videoElement.srcObject = stream;
      const track = stream.getTracks()[0];
      state.isCapture = true;

      // Start decoding
      codeReader.decodeFromVideoElement(videoElement)
        .then(async result => {
            if (result.text === null) return;

            // extract query string
            const url = new URL(result.text);
            const mark = url.searchParams.get('mark');
            const title = url.searchParams.get('title');

            // // extract location from q
            // const location = url.searchParams.get('q');
            // const [latitude, longitude] = location.split('?q=')[1].split(',');

            
            if (mark !== 'sosohaja') {
              alert('잘못된 QR 코드입니다.');

              // restart QR capture
              track.stop();
              videoElement.srcObject = null; // Clean up video element
              setLocationUrl(url);
              QRCapture();
              return;
            }

            if (mark === 'sosohaja') {
              track.stop();
              videoElement.srcObject = null; // Clean up video element
              
              const { data: { data }} = await getQRByTitle(title).catch((err) => {
                console.error(err);
              });

              setQr(data[0]);

              setLocationUrl(url);
              router.push(`/defect`);
            }

            // Stop the video stream when you have the result
          })
          .catch(err => console.error(err))

    })
    .catch(err => console.error('Error accessing video stream', err));
};

onMounted(() => {
  if (process.client) {
    setFileList([]);
    QRCapture();
  }
})


</script>
<template>
  <Desktop v-if="$device.isDesktop"
    :isCapture="state.isCapture"
  />
  <Mobile v-else 
    :isCapture="state.isCapture"
  />
</template>