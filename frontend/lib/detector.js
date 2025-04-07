// import yolov5n_weight from "../weights/best_web_model/model.json";

// const yolov5n_weight = "https://raw.githubusercontent.com/da22so/tfjs_models/main/yolov5n_web_model/model.json"
const yolov5n_weight = "/weights/best_web_model/model.json";

const coco_names = ['수정', '오염', '훼손'];


function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export const isMobile = () => {
  return isAndroid() || isiOS();
}

export const drawImageOnCanvas = (canvas, ctx, img) => {
  const [imgWidth, imgHeight] = [img.width, img.height];
  const [canvasWidth, canvasHeight] = [canvas.width, canvas.height];
  const [widthRatio, heightRatio] = [canvasWidth / imgWidth, canvasHeight / imgHeight];
  const scale = Math.min(widthRatio, heightRatio);
  const [newWidth, newHeight] = [imgWidth * scale, imgHeight * scale];
  const xOffset = (canvasWidth - newWidth) / 2;
  const yOffset = (canvasHeight - newHeight) / 2;
  ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
}

/**
 * detector 모델을 로드하는 함수
 * @returns 
 */
export const loadDetector = async () => {
  return tf.loadGraphModel(yolov5n_weight);
}

/**
 * detect한 결과를 반환하는 함수
 * @param {*} detector 
 * @param {*} input 
 * @returns 
 */
const getDetectorResults = async (detector = null, input) => {
  if (detector == null) return null;

  try {
    return await detector.executeAsync(input);
  } catch (error) {
    // console.log(error);
    return null;
  }
}

/**
 * 인식된 객체 외곽선을 그리는 함수
 * @param {*} detect_res 
 */
const drawBoundingBox = (canvas, ctx, detect_res, boundingBoxArray = []) => {
    boundingBoxArray.splice(0, boundingBoxArray.length);
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
  
    const [boxes, scores, classes, valid_detections] = detect_res;
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    const valid_detections_data = valid_detections.dataSync()[0];

    // console.log(boxes_data);
    // console.log(scores_data);
    // console.log(classes_data);
    // console.log(valid_detections_data);
    
    tf.dispose(detect_res);
  
    var i;
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= canvas.width;
      x2 *= canvas.width;
      y1 *= canvas.height;
      y2 *= canvas.height;
      const width = x2 - x1;
      const height = y2 - y1;
      const klass = coco_names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      boundingBoxArray.push({ x1, y1, x2, y2, width, height, klass, score });
  
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x1, y1, width, height);
  
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(klass + ":" + score).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);
  
    }
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= canvas.width;
      y1 *= canvas.height;
      const klass = coco_names[classes_data[i]];
      const score = scores_data[i].toFixed(2);
  
      // Draw the text last to ensure it's on top.
  
      ctx.fillStyle = "#000000";
      ctx.fillText(klass + ":" + score, x1, y1);
  
    }
}

/**
 * 이미지(사진)를 인식하여 외곽선을 그리는 함수
 * @param {*} canvas 
 * @param {*} ctx 
 * @param {*} imageData 
 * @param {*} detector 
 */
export const imageRenderPrediction = async (canvas, ctx, imageData, detector, boundingBoxArray = []) => {
  const [modelWidth, modelHeight] = detector.inputs[0].shape.slice(1, 3);
  const input = tf.tidy(() => {
    return tf.image.resizeBilinear(tf.browser.fromPixels(imageData), [modelWidth, modelHeight])
      .div(255.0).expandDims(0);
  });

  // Detector can be null if initialization failed (for example when loading from a URL that does not exist).
  const detect_res = await getDetectorResults(detector, input);
  
  if (detect_res != null) drawBoundingBox(canvas, ctx, detect_res, boundingBoxArray);
  tf.dispose(input);
}

/**
 * 비디오를 인식하여 외곽선을 그리는 함수
 * @param {*} canvas 
 * @param {*} ctx 
 * @param {*} videoEl 
 * @param {*} detector 
 */
async function videoRenderPredict(canvas, ctx, videoEl, detector, boundingBoxArray = []) {
  const [modelWidth, modelHeight] = detector.inputs[0].shape.slice(1, 3);
  const input = tf.tidy(() => {
    return tf.image.resizeBilinear(tf.browser.fromPixels(videoEl), [modelWidth, modelHeight])
      .div(255.0).expandDims(0);
  });

  // Detector can be null if initialization failed (for example when loading from a URL that does not exist).
  const detect_res = await getDetectorResults(detector, input);

  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  
  if (detect_res != null) drawBoundingBox(canvas, ctx, detect_res, boundingBoxArray);
  tf.dispose(input);
}

/**
 * 비디오를 인식하여 외곽선을 그리는 함수 (재귀호출)
 * @param {*} canvas 
 * @param {*} ctx 
 * @param {*} videoEl 
 * @param {*} detector 
 */
export async function videoRenderPrediction (canvas, ctx, videoEl, detector, boundingBoxArray = []) {
  await videoRenderPredict(canvas, ctx, videoEl, detector, boundingBoxArray);

  if (window.rafId === 0) return;
  window.rafId = requestAnimationFrame(function() {
    videoRenderPrediction(canvas, ctx, videoEl, detector, boundingBoxArray);
  });
}


export const stopVideoPrediction = () => {
  if (window.rafId) {
    cancelAnimationFrame(window.rafId);
    window.rafId = 0;
  }
}