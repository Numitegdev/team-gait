export function detectBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Edg")) {
    return "Microsoft Edge";
  }

  if (ua.includes("Chrome")) {
    return "Google Chrome";
  }

  if (ua.includes("Firefox")) {
    return "Mozilla Firefox";
  }

  if (ua.includes("Safari")) {
    return "Safari";
  }

  return "Unknown";
}

export function getGPU() {
  const canvas =
    document.createElement("canvas");

  const gl = canvas.getContext("webgl");

  if (!gl) {
    return "Unavailable";
  }

  const debugInfo = gl.getExtension(
    "WEBGL_debug_renderer_info"
  );

  if (!debugInfo) {
    return "Unavailable";
  }

  return gl.getParameter(
    debugInfo.UNMASKED_RENDERER_WEBGL
  );
}