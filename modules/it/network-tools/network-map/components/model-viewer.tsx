"use client";

import { useEffect , useState}
from "react";

import {
  useGLTF,
  useAnimations,
} from "@react-three/drei";

interface Props {
  model: string;
  onObjectClick: (
    objectName: string
  ) => void;
}

export function ModelViewer({
  model,
  onObjectClick,
}: Props) {

  const {
    scene,
    animations,
  } = useGLTF(model);

  const { actions } =
    useAnimations(
      animations,
      scene
    );

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

  useEffect(() => {

    Object.values(actions)
      .forEach((action: any) => {

        if (!action) return;

        action
          .reset()
          .play();

      });

  }, [actions]);

  useEffect(() => {

    scene.traverse(
      (child: any) => {

        if (child.isMesh) {

          child.castShadow = true;
          child.receiveShadow = true;

        }
      }
    );

  }, [scene]);

  return (
    
    <primitive
      object={scene}
      scale={
        isMobile
            ? 2
            : 3
        }
      
     position={
        isMobile
            ? [0, -1.2, 0]
            : [0, -2, 0]
        }
      onClick={(e: any) => {

        e.stopPropagation();

        onObjectClick(
          e.object.name
        );

      }}
    />
  );
}