import NetworkMapViewer
from "./components/network-map-viewer";

export default function NetworkMapPage() {

  return (
    <NetworkMapViewer
      model="/models/MAP.glb"
    />
  );
}