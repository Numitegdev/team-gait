export async function getCameraStream() {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
}

export function stopCameraStream(
  stream: MediaStream | null
) {
  stream?.getTracks().forEach((track) =>
    track.stop()
  );
}