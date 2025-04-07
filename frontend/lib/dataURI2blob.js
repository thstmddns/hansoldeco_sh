// http://charlie0301.blogspot.com/2014/10/html5-canvas-blob-data-post-upload.html
export const dataURI2Blob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], { type: mimeString });
    return bb;
}
