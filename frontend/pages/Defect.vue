<script setup>
import Desktop from '../views/Defect/Desktop.vue';
import Mobile from '../views/Defect/Mobile.vue';
import { isMobile, loadDetector, imageRenderPrediction, videoRenderPrediction, stopVideoPrediction  } from '../lib/detector';
import { storeToRefs } from "pinia";
import { useModalStore } from '../stores/modal';
import { useQRStore } from '../stores/qr';
import { useDefectStore } from '../stores/defect';
import checkWebGLSupport from '~/lib/checkWebGLSupport';

const router = useRouter();

const modalStore = useModalStore();
const qrStore = useQRStore();
const defectStore = useDefectStore();

const { qr } = storeToRefs(qrStore);
const { location_url, file_list } = storeToRefs(defectStore);
const { setLoadingModal } = modalStore;
const { setFileList } = defectStore;

let ctx = null;
let detector;

const boundingBoxArray = ref([]);
const childRef = ref(null);

const state = reactive({
  introduction_message: {
    'no_file_attached': '사진을 올리거나 촬영해주세요.',
    'capturing_photo': '사진을 촬영중입니다.',
    'file_attached': '사진을 검사해주세요.',
  },
  current_status: "no_file_attached",
  current_attached_file_name: "",
  current_attached_file: null,
  imageData: null,
});

const drawImageOnCanvasByFile = (file) => {
  // Create an object URL for the file
  const imageUrl = URL.createObjectURL(file);

  const image = new Image();
  // state.imageData = image;
  image.onload = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const parentDiv = document.querySelector(".preview-image");
    
    canvas.width = parentDiv.clientWidth;
    canvas.height = parentDiv.clientHeight;

    const aspectRatio = image.width / image.height;
    let newWidth = canvas.width;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth; // bounding box를 이미지 안에 들어오게 하기 위한 임시 방편
    canvas.height = newHeight; // bounding box를 이미지 안에 들어오게 하기 위한 임시 방편

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image centered
    // ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
    ctx.drawImage(image, 0, 0, newWidth, newHeight); // bounding box를 이미지 안에 들어오게 하기 위한 임시 방편

    // make new Image by newWidth, newHeight
    const newCanvas = document.createElement('canvas');
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    const newCtx = newCanvas.getContext('2d');
    newCtx.drawImage(image, 0, 0, newWidth, newHeight);
    // state.imageData = newCanvas;
    state.imageData = new Image(newWidth, newHeight);
    state.imageData.src = newCanvas.toDataURL("image/jpeg");


    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imageUrl);
  };
  image.onerror = () => {
    console.error("Error loading image");
    // Optionally revoke the object URL on error
    URL.revokeObjectURL(imageUrl);
  };
  
  image.src = imageUrl;
}

const handleClickUpload = (e) => {
  if (state.current_status === "capturing_photo") stopVideoPrediction();
  const input = document.querySelector(".upload-input");
  input.click(e);
};


const handleChangeFileUpload = async (e) => {
  if (!e.currentTarget.files[0]) return;
  setLoadingModal(true);

  const files = e.currentTarget.files;
  state.current_attached_file_name = files[0].name;
  state.current_attached_file = files[0];

  drawImageOnCanvasByFile(files[0]);
  state.current_status = "file_attached";
  detector = await loadDetector();

  setTimeout(() => {
    imageRenderPrediction(childRef.value.canvas, ctx, state.imageData, detector, boundingBoxArray.value); // 에러의심

    setLoadingModal(false);
  }, 3000);

  
};


const handleClickCapturePhoto = async () => {
  const webGLSupport = await checkWebGLSupport();

  if (!webGLSupport) {
    alert("WebGL을 지원하지 않는 기기상태 \n혹은 브라우저 이므로 실시간 캡쳐를 할 수 없습니다.");
    return;
  }

  window.rafId = null;
  state.current_status = "capturing_photo";
  state.current_attached_file_name = "Capturing photo...";

  try {
    const canvas = document.querySelector('canvas');
    const parentDiv = document.querySelector(".preview-image");

    canvas.width = parentDiv.clientHeight / 1.77;
    canvas.height = parentDiv.clientHeight;
    

    const videoConfig = {
      'audio': false,
      'video': {
        // facingMode: 'user',
        facingMode: 'environment',
        width: canvas.width,
        height: canvas.height
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    childRef.value.video.srcObject = stream;


    childRef.value.video.onloadedmetadata = async () => {
      // childRef.value.video.play();
      ctx = childRef.value.canvas.getContext("2d");
      detector = await loadDetector();
      
      videoRenderPrediction(childRef.value.canvas, ctx, childRef.value.video, detector, boundingBoxArray.value);

    };

  } catch (error) {
    console.error("Error capturing photo:", error);
  }
};

const handleClickStopCapture = async (e) => {
  e.preventDefault();
  
  const canvas = childRef.value.canvas;
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;
  offCtx.drawImage(childRef.value.video, 0, 0, offCanvas.width, offCanvas.height);

  // videoTrack.stop();
  
  stopVideoPrediction();

  state.imageData = new Image(offCanvas.width, offCanvas.height);
  state.imageData.src = offCanvas.toDataURL("image/jpeg");
  state.current_attached_file_name = new Date().toISOString() + ".jpg";
  state.current_status = "file_attached";
};

const handleClickExecute = () => {
  const origin_image = state.imageData.src;
  const canvas = childRef.value.canvas;
  const bounding_box_image = canvas.toDataURL("image/jpeg");
  // const blob = await fetch(image).then(res => res.blob());

  setFileList([...file_list.value, { filename: state.current_attached_file_name, origin_image, bounding_box_image, bounding_box_array: boundingBoxArray.value }]);

  router.push("/register");
};

onMounted(() => {
  if (!qr.value?.id) {
    router.push('/');
  }

  ctx = childRef.value.canvas.getContext("2d");
})
</script>

<template>
  <Desktop v-if="$device.isDesktop" 
    ref="childRef"
    :current_attached_file_name="state.current_attached_file_name"
    :current_attached_file="state.current_attached_file"
    :imageData="state.imageData"
    @handleClickUpload="handleClickUpload"
    @handleChangeFileUpload="handleChangeFileUpload"
    @handleClickExecute="handleClickExecute"
  />
  <Mobile v-else 
    ref="childRef"
    :introduction_message="state.introduction_message"
    :current_status="state.current_status"
    :current_attached_file_name="state.current_attached_file_name"
    :current_attached_file="state.current_attached_file"
    :imageData="state.imageData"
    @handleClickUpload="handleClickUpload"
    @handleChangeFileUpload="handleChangeFileUpload"
    @handleClickCapturePhoto="handleClickCapturePhoto"
    @handleClickStopCapture="handleClickStopCapture"
    @handleClickExecute="handleClickExecute"
  />
</template>