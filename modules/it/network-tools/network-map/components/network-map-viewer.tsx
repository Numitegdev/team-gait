"use client";

import { Suspense, useEffect , useState , } from "react";

import { Canvas } from "@react-three/fiber";

import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import { ModelViewer }
from "./model-viewer";

import { MapFooterNavigation }
from "./map-footer-navigation";

import { useRoomInfo }
from "../hooks/use-room-info";

interface Props {
  model: string;
}

export default function NetworkMapViewer({
  model,
}: Props) {

  const {
    selectedRoom,
    roomInfo,
    loadRoom,
  } = useRoomInfo();

  const [isMobile, setIsMobile] =
  useState(false);

useEffect(() => {

  function handleResize() {

    setIsMobile(
      window.innerWidth < 768
    );

  }

  handleResize();

  window.addEventListener(
    "resize",
    handleResize
  );

  return () =>
    window.removeEventListener(
      "resize",
      handleResize
    );

}, []);
  return (

    <div
      className="
        relative
        flex
        h-[calc(100vh-80px)]
        w-full
        overflow-hidden
      "
    >

      {/* 3D MAP */}

      <div
        className="
            flex-1
            h-full
            pb-24
        "
        >

        <Canvas
      camera={{
            position: isMobile
                ? [12, 8, 12]
                : [18, 14, 18],

            fov: isMobile
                ? 60
                : 45,
            }}
                    >

          <ambientLight intensity={1} />

          <directionalLight
            position={[10, 10, 5]}
            intensity={2}
          />

          <Suspense fallback={null}>

            <ModelViewer
              model={model}
              onObjectClick={loadRoom}
            />

            <Environment preset="city" />

          </Suspense>

         <OrbitControls
            enablePan
            enableZoom
            enableRotate

            minDistance={8}
            maxDistance={40}

            maxPolarAngle={
                Math.PI / 2.1
            }
            />

        </Canvas>

      </div>

      {/* SIDEBAR */}

      <div
        className="
            hidden
            md:block

            w-96
            border-l
            bg-white
            p-6
            pb-24
            overflow-auto
        "
        >

        <h2
          className="
            text-xl
            font-bold
            mb-4
          "
        >
          Room Information
        </h2>

        {!selectedRoom && (

          <div
            className="
              rounded-xl
              border
              p-4
              text-slate-500
            "
          >
            Klik ruangan pada map.
          </div>

        )}

        {roomInfo && (

          <div className="space-y-4">

            <InfoCard
              title="Room Code"
              value={roomInfo.room_code}
            />

            <InfoCard
              title="Room Name"
              value={roomInfo.room_name}
            />

            <InfoCard
              title="Building"
              value={roomInfo.building}
            />

            <InfoCard
              title="Floor"
              value={roomInfo.floor}
            />

            <InfoCard
              title="Pool Start"
              value={roomInfo.pool_start}
            />

            <InfoCard
              title="Pool End"
              value={roomInfo.pool_end}
            />

            <InfoCard
              title="Cable Code"
              value={roomInfo.cable_code}
            />

            <InfoCard
              title="Network Type"
              value={roomInfo.network_type}
            />

          </div>

        )}

      </div>

      {/* Floating NAVIGATION */}

      {/* MOBILE ROOM INFO */}

        <div
          className="
            absolute
            bottom-20
            left-8
            right-8
            z-20

            md:hidden
          "
        >

          {roomInfo && (

            <div
              className="
                rounded-xl
                border
                bg-white/95
                backdrop-blur
                shadow-lg
              "
            >

              <div className="p-3 space-y-2">

                <div>

                  <p className="text-xs text-slate-500">
                    Room Code
                  </p>

                  <p className="font-semibold">
                    {roomInfo.room_code}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Room Name
                  </p>

                  <p className="font-semibold">
                    {roomInfo.room_name}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Cable Code
                  </p>

                  <p className="font-semibold">
                    {roomInfo.cable_code}
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* Floating NAVIGATION */}

        <MapFooterNavigation />

    </div>

  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div
      className="
        rounded-xl
        border
        p-4
      "
    >

      <p
        className="
          text-xs
          text-slate-500
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          font-semibold
          break-all
        "
      >
        {value}
      </p>

    </div>

  );
}