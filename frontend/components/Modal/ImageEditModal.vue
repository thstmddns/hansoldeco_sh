<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "../../stores/modal";
import { useReportStore } from "../../stores/report";
import { useImageEditStore } from "../../stores/image_edit";
import { putDefect } from "~/api/defect";
import { getReportListByQR } from "~/api/report";
import { uploadImageByDataURI } from "~/api/serverless";

const router = useRouter();

const modalStore = useModalStore();
const reportStore = useReportStore();
const imageEditStore = useImageEditStore();

const { isShowImageEditModal } = storeToRefs(modalStore);
const { imageEditSource } = storeToRefs(imageEditStore);

const { setImageEditModal, setLoadingModal } = modalStore;
const { setReportList } = reportStore;

const canvas = ref(null);
const imageDom = ref(null);

const state = reactive({
    isShowBoundingBox: true,
    selectedBoundingBox: null,
    boundingBoxList: [],

    // zoom in and out
    originX: 0,
    originY: 0,
    scale: 1,

    // dragging
    lastMouseX: 0,
    lastMouseY: 0,
    preMouseX: 0,
    preMouseY: 0,
    isDragging: false,

    // bounding box temp info
    klass: "수정",
    score: 1,
    width: null,
    height: null,
})

function clearCanvas() {
    const context = canvas.value.getContext("2d");
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.restore();
}

function isInsideBox(point, box) {
  return point.x >= box.x1 && point.x <= box.x2 &&
         point.y >= box.y1 && point.y <= box.y2;
}

function screenToCanvas(x, y) {
    const inverseZoom = 1 / state.scale;
    return {
        x: (x - state.originX) * inverseZoom,
        y: (y - state.originY) * inverseZoom
    };
}

const applyTransform = () => {
    const context = canvas.value.getContext("2d");
    // context.setTransform(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4],matrix[5]);
    context.setTransform(state.scale, 0, 0, state.scale, state.originX, state.originY);
}

const scaleAt = (at, amount) => {
    state.scale *= amount;
    state.originX = at.x - (at.x - state.originX) * amount;
    state.originY = at.y - (at.y - state.originY) * amount;
}

const drawBoundingBox = (x, y, w, h) => {
    const context = canvas.value.getContext("2d");

    if (state.selectedBoundingBox && state.selectedBoundingBox.x1 === x && state.selectedBoundingBox.y1 === y) context.strokeStyle = "#FF0000";
    else context.strokeStyle = "#00FFFF";

    context.lineWidth = 4;
    context.strokeRect(x, y, w, h);
}

const drawLabel = (x, y, label) => {
    const context = canvas.value.getContext("2d");

    if (state.selectedBoundingBox && state.selectedBoundingBox.x1 === x && state.selectedBoundingBox.y1 === y) context.fillStyle = "#FF0000";
    else context.fillStyle = "#00FFFF";

    context.fillRect(x, y, 64, 20 + 4);

    context.fillStyle = "#000000";
    context.font = "12px sans-serif";
    context.baseLine = "top";
    context.fillText(label, x, y + 20);
}

const drawBoundingBoxesAndLabels = () => {
    const context = canvas.value.getContext("2d");

    context.drawImage(imageDom.value, 0, 0);

    state.boundingBoxList.forEach((box) => {
        drawBoundingBox(box.x1, box.y1, box.width, box.height);
    });
    state.boundingBoxList.forEach((box) => {
        drawLabel(box.x1, box.y1, box.klass + ' : ' + Number(box.score).toFixed(2));
    });
}

const draw = () => {
    if (!canvas.value) return;
    const context = canvas.value.getContext("2d");

    clearCanvas();
    applyTransform();

    if (state.isShowBoundingBox) drawBoundingBoxesAndLabels();
    if (!state.isShowBoundingBox) context.drawImage(imageDom.value, 0, 0);

    requestAnimationFrame(draw);
}

const draggingCanvas = (e) => {
    if (!state.isDragging) return;
    if (state.selectedBoundingBox) return;

    const dx = e.clientX - state.preMouseX;
    const dy = e.clientY - state.preMouseY;

    state.originX += dx;
    state.originY += dy;

    state.preMouseX = e.clientX;
    state.preMouseY = e.clientY;

    clearCanvas();
    drawBoundingBoxesAndLabels();

}

const draggingSelectedBoundingBox = (e) => {
    if (!state.isDragging) return;
    if (!state.selectedBoundingBox) return;

    const pt = screenToCanvas(e.offsetX, e.offsetY);

    state.selectedBoundingBox.x1 = pt.x - state.selectedBoundingBox.width / 2;
    state.selectedBoundingBox.y1 = pt.y - state.selectedBoundingBox.height / 2;
    state.selectedBoundingBox.x2 = pt.x + state.selectedBoundingBox.width / 2;
    state.selectedBoundingBox.y2 = pt.y + state.selectedBoundingBox.height / 2;
    
    clearCanvas();
    drawBoundingBoxesAndLabels();
}

const selectBoundingBox = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const context = canvas.value.getContext("2d");
    const point = screenToCanvas(x, y); // Convert mouse point to canvas coordinates

    const selectBoundingBox = state.boundingBoxList.map((box) => {
        if (isInsideBox(point, box)) {
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
    };
}

const handleMouseDownCanvas = (e) => {
    state.isDragging = true;
    state.preMouseX = e.clientX;
    state.preMouseY = e.clientY;

    selectBoundingBox(e);
}

const handleMouseMoveCanvas = (e) => {
    draggingCanvas(e);
    draggingSelectedBoundingBox(e);
}

const handleMouseUpCanvas = (e) => {
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
    state.isDragging = false;
}

const handleWheelCanvas = (event) => {
    event.preventDefault();

    const delta = event.wheelDelta;

    if (delta > 0) {
        scaleAt({x: event.offsetX, y: event.offsetY}, 1.015);
    } else {
        scaleAt({x: event.offsetX, y: event.offsetY}, 1 / 1.015);
    }
}

const handleClickClose = () => {
    setImageEditModal(false);
};

const handleClickOffBoundingBox = () => {
    state.isShowBoundingBox = false;
}

const handleClickOnBoundingBox = () => {
    state.isShowBoundingBox = true;
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

    state.selectedBoundingBox = state.boundingBoxList[state.boundingBoxList.length - 1];
}

const handleClickRemoveBoundingBox = () => {
    if (!state.selectedBoundingBox) return;
    state.boundingBoxList = state.boundingBoxList.filter((box) => box !== state.selectedBoundingBox);
    state.selectedBoundingBox = null;
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

    alert('하자 정보가 수정되었습니다.(저장되지 않았습니다.)');
}

const handleClickSave = async () => {
    setLoadingModal(true);
    const qrID = router.currentRoute.value.query.qr;

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
        const { data: { data } } = await getReportListByQR(qrID).catch((err) => {
            console.error(err);
        });

        // descending order by createdAt
        const reportList = data.sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt));

        setReportList(reportList);
        setLoadingModal(false);

        alert('하자 정보가 저장되었습니다.');
    })
    .catch((err) => {
        console.error(err);
    });
}


watch(canvas, (newVal) => {
    if (isShowImageEditModal.value) {
        const parent = canvas.value.parentElement;
        canvas.value.width = parent.clientWidth;
        canvas.value.height = parent.clientHeight;
        canvas.value.width = 700;
        canvas.value.height = 700;

        state.scale = 1;
        state.originX = 0;
        state.originY = 0;

        const context = canvas.value.getContext("2d");
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        imageDom.value = new Image();
        imageDom.value.crossOrigin = "anonymous";
        imageDom.value.src = imageEditSource.value.origin_image_url + '?' + new Date().getTime();
        imageDom.value.onload = () => {
            state.boundingBoxList = JSON.parse(JSON.stringify(imageEditSource.value.bounding_box_json));
            draw();

        }
    }
});


</script>
<template>
    <div v-if="isShowImageEditModal" class="modal_wrapper z-9999 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full m-auto">
        <div class="fixed left-0 top-0 right-0 bottom-0 m-auto py-34 px-45 w-1280 h-832 bg-[#fff] flex flex-col rounded-xl border border-[#93D07F]">
            <h3 class="text-28 mb-20 font-medium">하자 검사 결과 편집</h3>
            <img src="/assets/cross.png" alt="cross" class="right-30 top-30 absolute w-20 h-20 cursor-pointer" @click="handleClickClose" />
            <div class="gap-34 flex w-full">
                <section class="w-800 h-705 flex items-center justify-center">
                    <canvas ref="canvas" class="bg-white" @mousedown="handleMouseDownCanvas" @mousemove="handleMouseMoveCanvas" @mouseup="handleMouseUpCanvas" @wheel="handleWheelCanvas"></canvas>
                </section>
                <section class="w-370 h-705 gap-45 flex flex-col">
                    <li class="flex w-full">
                        <div class="h-30 flex items-center w-20">
                            <span class="w-10 h-10 bg-[#84C96E] rounded-full block"></span>
                        </div>
                        <div class="flex flex-col w-full">
                            <h4 class="h-26 text-22 mb-16 font-medium">이미지 파일명</h4>
                            <p class="w-full h-35 flex items-center px-12 border border-[#93D07F] rounded-md mb-36">{{imageEditSource.file_name}}</p>
                            <button type="button" class="w-full h-60 text-22 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickAddBoundingBox">하자 표적 추가하기</button>
                        </div>
                    </li>
                    <li class="flex w-full">
                        <div class="h-30 flex items-center w-20">
                            <span class="w-10 h-10 bg-[#84C96E] rounded-full block"></span>
                        </div>
                        <div class="relative flex flex-col w-full">
                            <h4 class="h-26 text-22 mb-16 font-medium">하자 정보</h4>
                            <img v-if="state.isShowBoundingBox" src="/assets/eye_open.png" alt="eye_open" class="top-8 w-25 h-25 absolute right-0 cursor-pointer" @click="handleClickOffBoundingBox" />
                            <img v-if="!state.isShowBoundingBox" src="/assets/eye_close.png" alt="eye_close" class="top-8 w-25 h-25 absolute right-0 cursor-pointer" @click="handleClickOnBoundingBox" />
                            <div class="w-full h-140 flex flex-col items-center justify-between p-12 border border-[#93D07F] rounded-md mb-36">
                                <div class="h-60 flex items-center justify-between w-full rounded-md">
                                    <span class="w-70">하자 종류</span>
                                    <select class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.klass !== null ? state.klass : state.selectedBoundingBox?.klass" @input="handleInputKlass">
                                        <option value="수정">수정</option>
                                        <option value="오염">오염</option>
                                        <option value="훼손">훼손</option>
                                    </select>
                                </div>
                                <div class="h-60 flex items-center justify-between w-full rounded-md">
                                    <span class="w-70">너비</span>
                                    <input type="text" class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.width !== null ? state.width : state.selectedBoundingBox?.width.toFixed(2)" @input="handleInputWidth"/>
                                </div>
                                <div class="h-60 flex items-center justify-between w-full rounded-md">
                                    <span class="w-70">높이</span>
                                    <input type="text" class="w-190 h-30 pl-12 border border-[#93D07F] rounded-md" :value="state.height !== null ? state.height : state.selectedBoundingBox?.height.toFixed(2)" @input="handleInputHeight"/>
                                </div>
                            </div>
                            <div class="flex justify-between mb-40">
                                <button type="button" class="w-150 h-30 text-18 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickRemoveBoundingBox">선택된 하자 삭제</button>
                                <button type="button" class="w-170 h-30 text-18 bg-[#A2DB8F] text-white rounded-md shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickUpdateBoundingBox">선택된 하자 정보 수정</button>
                            </div>
                            <button type="button" class="ml-auto w-120 h-45 text-18 bg-[#84C96E] text-white rounded-full shadow shadow-[rgba(0,0,0,0.25)]" @click="handleClickSave">저장하기</button>
                        </div>
                    </li>
                </section>
            </div>
        </div>
    </div>
</template>
<style>
</style>

