// Function to check for WebGL support
function checkWebGLSupport() {
    // Try to create a canvas element
    var canvas = document.createElement('canvas');
    
    // Try to get the WebGL rendering context for the canvas
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // If the WebGL context is not available, log an error message
    if (!gl) {
      console.error('WebGL is not supported in this browser.');
      return false;
    } else {
      console.log('WebGL is supported.');
      return true;
    }
}

export default checkWebGLSupport;