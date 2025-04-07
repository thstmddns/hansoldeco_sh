<script setup>
import Header from "../components/Header/Mobile.vue";
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useModalStore } from "../stores/modal";
import { useImageEditStore } from "../stores/image_edit";
import { putDefect } from "~/api/defect";
import { getReports } from "~/api/report";
import { uploadImageByDataURI } from "~/api/serverless";

const router = useRouter();

const canvas = ref(null);
const imageDom = ref(null);

const modalStore = useModalStore();
const imageEditStore = useImageEditStore();
const reportStore = useReportStore();

const { imageEditSource } = storeToRefs(imageEditStore);

const { setLoadingModal } = modalStore;
const { setReportList } = reportStore;

const state = reactive({
    isShowBoundingBox: true,
    selectedBoundingBox: null,
    boundingBoxList: [],

    // zoom in and out & dragging
    originX: 0,
    originY: 0,

    // zoom in and out
    zoomOriginX: 0,
    zoomOriginY: 0,
    scale: 1,
    currentzoom: 1,
    mousex: 0,
    mousey: 0,

    // dragging
    lastMouseX: 0,
    lastMouseY: 0,
    isDragging: false,

    // bounding box temp info
    klass: "수정",
    score: 1,
    width: null,
    height: null,
});

const drawBoundingBox = (x, y, w, h) => {
    const context = canvas.value.getContext("2d");

    const scaledX = state.originX + x * state.scale;
    const scaledY = state.originY + y * state.scale;
    const scaledW = w * state.scale;
    const scaledH = h * state.scale;

    if (state.selectedBoundingBox && state.selectedBoundingBox.x1 === x && state.selectedBoundingBox.y1 === y) context.strokeStyle = "#FF0000";
    else context.strokeStyle = "#00FFFF";

    context.lineWidth = 4;
    context.strokeRect(scaledX, scaledY, scaledW, scaledH);
}

const drawLabel = (x, y, label) => {
    const context = canvas.value.getContext("2d");

    const scaledX = state.originX + x * state.scale;
    const scaledY = state.originY + y * state.scale;

    if (state.selectedBoundingBox && state.selectedBoundingBox.x1 === x && state.selectedBoundingBox.y1 === y) context.fillStyle = "#FF0000";
    else context.fillStyle = "#00FFFF";

    context.fillRect(scaledX, scaledY, 64, 20 + 4);

    context.fillStyle = "#000000";
    context.font = "12px sans-serif";
    context.baseLine = "top";
    context.fillText(label, scaledX, scaledY + 20);
}

const drawBoundingBoxesAndLabels = () => {
    const context = canvas.value.getContext("2d");

    context.drawImage(imageDom.value, state.originX + 0, state.originY + 0, imageDom.value.width * state.scale, imageDom.value.height * state.scale);

    state.boundingBoxList.forEach((box) => {
        drawBoundingBox(box.x1, box.y1, box.width, box.height);
    });
    state.boundingBoxList.forEach((box) => {
        drawLabel(box.x1, box.y1, box.klass + ' : ' + Number(box.score).toFixed(2));
    });
}

const draw = () => {
    const context = canvas.value.getContext("2d");

    context.save();
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);

    if (state.isShowBoundingBox) drawBoundingBoxesAndLabels();
    if (!state.isShowBoundingBox) context.drawImage(imageDom.value, state.originX, state.originY, imageDom.value.width * state.scale, imageDom.value.height * state.scale);
    context.restore();
}


const draggingSelectedBoundingBox = (e) => {
    if (!state.isDragging) return;
    if (!state.selectedBoundingBox) return;

    e.preventDefault();

    const context = canvas.value.getContext("2d");
    const deltaX = e.touches[0].clientX - state.lastMouseX;
    const deltaY = e.touches[0].clientY - state.lastMouseY;

    context.clearRect(0, 0, canvas.value.width, canvas.value.height);
    state.lastMouseX = e.touches[0].clientX;
    state.lastMouseY = e.touches[0].clientY;
    state.selectedBoundingBox.x1 += deltaX;
    state.selectedBoundingBox.y1 += deltaY;
    state.selectedBoundingBox.x2 += deltaX;
    state.selectedBoundingBox.y2 += deltaY;

    drawBoundingBoxesAndLabels();
}

const selectBoundingBox = (e) => {
    const context = canvas.value.getContext("2d");

    const x = e.offsetX;
    const y = e.offsetY;

    const selectBoundingBox = state.boundingBoxList.map((box) => {
        if (x >= state.originX + box.x1 * state.scale && x <= state.originX + (box.x1 + box.width) * state.scale && y >= state.originY + box.y1 * state.scale && y <= state.originY + (box.y1 + box.height) * state.scale) {
            state.selectedBoundingBox = box;
            
            state.klass = box.klass;
            state.width = box.width.toFixed(2);
            state.height = box.height.toFixed(2);

            context.clearRect(0, 0, canvas.value.width, canvas.value.height);
            drawBoundingBoxesAndLabels();

            return box;
        } 
    });

    if (selectBoundingBox.every((box) => !box)) {
        state.selectedBoundingBox = null;
        draw();
    };
}

const handleTouchStartCanvas = (e) => {
    state.isDragging = true;
}

const handleMouseDownCanvas = (e) => {
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
    state.isDragging = true;
    selectBoundingBox(e);
}

const handleTouchMove = (e) => {
    draggingSelectedBoundingBox(e);
}

const handleMouseMoveCanvas = (e) => {
}

const handleTouchEnd = (e) => {
    state.isDragging = false;
}

const handleMouseUpCanvas = (e) => {
    state.isDragging = false;
}

const handleWheelCanvas = (e) => {
}

const handleClickOffBoundingBox = () => {
    state.isShowBoundingBox = false;
    draw();
}

const handleClickOnBoundingBox = () => {
    state.isShowBoundingBox = true;
    draw();
}

const handleClickAddBoundingBox = () => {
    state.boundingBoxList.push({
        x1: 0,
        y1: 0,
        x2: 100,
        y2: 100,
        width: 100,
        height: 100,
        klass: "수정",
        score: 1,
    });

    // state.selectedBoundingBox = state.boundingBoxList[state.boundingBoxList.length - 1];

    draw();
}

const handleClickRemoveBoundingBox = () => {
    if (!state.selectedBoundingBox) return;
    state.boundingBoxList = state.boundingBoxList.filter((box) => box !== state.selectedBoundingBox);
    state.selectedBoundingBox = null;
    draw();
}

const handleInputKlass = (e) => {
    state.klass = e.target.value;
}

const handleInputWidth = (e) => {
    state.width = e.target.value;
}

const handleInputHeight = (e) => {
    state.height = e.target.value;
}

const handleClickUpdateBoundingBox = () => {
    if (!state.selectedBoundingBox) return;
    state.selectedBoundingBox.klass = state.klass;
    state.selectedBoundingBox.width = Number(state.width);
    state.selectedBoundingBox.height = Number(state.height);
    draw();

    alert('하자 정보가 수정되었습니다.(저장되지 않았습니다.)');
}

const handleClickSave = async () => {
    setLoadingModal(true);

    // drawBoundingBoxesAndLabels on new canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.width = imageDom.value.width;
    newCanvas.height = imageDom.value.height;
    const newContext = newCanvas.getContext("2d");

    newContext.drawImage(imageDom.value, 0, 0);

    state.boundingBoxList.forEach((box) => {
        newContext.strokeStyle = "#00FFFF";
        newContext.lineWidth = 4;
        newContext.strokeRect(box.x1, box.y1, box.width, box.height);


        newContext.fillStyle = "#00FFFF";
        newContext.fillRect(box.x1, box.y1, 64, 20 + 4);
        newContext.fillStyle = "#000000";
        newContext.font = "12px sans-serif";
        newContext.baseLine = "top";
        newContext.fillText(box.klass + ' : ' + Number(box.score).toFixed(2), box.x1, box.y1 + 20);
    });

    const boundingBoxImage = newCanvas.toDataURL("image/png");

    const bounding_box_image = await uploadImageByDataURI(boundingBoxImage, new Date().toISOString() + ".jpg").catch((err) => {
      console.error(err);
    });

    await putDefect(imageEditSource.value.id, {
        bounding_box_image_url: bounding_box_image.data,
        bounding_box_json: state.boundingBoxList,
    })
    .then(async (res) => {
        const { data: { data } } = await getReports().catch((err) => {
            console.error(err);
        });

        // descending order by createdAt
        const reportList = data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));

        setReportList(reportList);
        setLoadingModal(false);

        router.back();
    })
    .catch((err) => {
        console.error(err);
    });
}


onMounted(() => {
    const parent = canvas.value.parentElement;
    canvas.value.width = parent.clientWidth;
    canvas.value.height = parent.clientHeight;

    const context = canvas.value.getContext("2d");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    imageDom.value = new Image();
    imageDom.value.crossOrigin = "anonymous";
    imageDom.value.src = imageEditSource.value.origin_image_url + '?' + new Date().getTime();
    imageDom.value.onload = () => {
        state.boundingBoxList = JSON.parse(JSON.stringify(imageEditSource.value.bounding_box_json));

        // // 이미지 좌표 중앙에 위치
        // state.originX = (canvas.value.width - imageDom.value.width) / 2;
        // state.originY = (canvas.value.height - imageDom.value.height) / 2;

        if (imageDom.value.width > canvas.value.width || imageDom.value.height > canvas.value.height) {
            // 이미지가 캔버스보다 크면 축소
            state.scale = Math.min(canvas.value.width / imageDom.value.width, canvas.value.height / imageDom.value.height);
            state.currentzoom = state.scale;

        } else {
            // 이미지가 캔버스보다 작으면 확대
            state.scale = Math.max(canvas.value.width / imageDom.value.width, canvas.value.height / imageDom.value.height);
            state.currentzoom = state.scale;
        }

        draw();

    }
})
</script>

<template>
  <Header />
  <main class="p-24 w-full flex flex-col items-center justify-center gap-24">
    <div class="w-full flex items-center overflow-hidden">
        <span class="w-10 h-10 rounded-full bg-[#84C96E] mr-12"></span>
        <span class="mr-16">이미지 파일명</span>
        <p class="pl-20 w-200 h-30 flex items-center text-10 border border-[#84C96E] rounded-md">{{ imageEditSource.file_name }}</p>
    </div>
    <div class="w-full h-350">
        <canvas ref="canvas" class="bg-white" @touchstart="handleTouchStartCanvas" @touchmove="handleTouchMove" @touchend="handleTouchEnd" @mousedown="handleMouseDownCanvas" @mousemove="handleMouseMoveCanvas" @mouseup="handleMouseUpCanvas" @wheel="handleWheelCanvas"></canvas>
    </div>
    <button type="button" class="w-full h-40 text-16 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickAddBoundingBox">하자 표적 추가하기</button>
    <div class="w-full flex items-center relative">
        <span class="w-10 h-10 rounded-full bg-[#84C96E] mr-12"></span>
        <span>하자 정보</span>
        <img v-if="state.isShowBoundingBox" src="/assets/eye_open.png" alt="eye_open" class="absolute top-0 right-0 w-25 h-25 cursor-pointer" @click="handleClickOffBoundingBox" />
        <img v-if="!state.isShowBoundingBox" src="/assets/eye_close.png" alt="eye_close" class="absolute top-0 right-0 w-25 h-25 cursor-pointer" @click="handleClickOnBoundingBox" />
    </div>
    <div class="w-full h-140 flex flex-col items-center justify-between p-12 border border-[#93D07F] rounded-md mb-36">
        <div class="w-full h-60 flex items-center justify-between  rounded-md">
            <span class="w-70">하자 종류</span>
            <select class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.klass !== null ? state.klass : state.selectedBoundingBox?.klass" @input="handleInputKlass">
                <option value="수정">수정</option>
                <option value="오염">오염</option>
                <option value="훼손">훼손</option>
            </select>
        </div>
        <div class="w-full h-60 flex items-center justify-between  rounded-md">
            <span class="w-70">너비</span>
            <input type="text" class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.width !== null ? state.width : state.selectedBoundingBox?.width.toFixed(2)" @input="handleInputWidth"/>
        </div>
        <div class="w-full h-60 flex items-center justify-between  rounded-md">
            <span class="w-70">높이</span>
            <input type="text" class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.height !== null ? state.height : state.selectedBoundingBox?.height.toFixed(2)" @input="handleInputHeight"/>
        </div>
    </div>
    <div class="w-full flex justify-between mb-30">
        <button type="button" class="w-120 h-30 text-12 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickRemoveBoundingBox">선택된 하자 삭제</button>
        <button type="button" class="w-120 h-30 text-12 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickUpdateBoundingBox">선택된 하자 정보 수정</button>
    </div>
    <button type="button" class="ml-auto w-100 h-40 rounded-full text-white bg-[#84C96E] shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickSave">저장하기</button>
  </main>
</template>
<style></style>
