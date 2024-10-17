'use client';

import { useEffect, useState } from 'react';
import { apiClientBiometric } from '@/services';
import Image from 'next/image';
import hands from '@/public/hands.jpeg';

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const AREAS: Area[] = [
  { id: 1, name: 'Pulgar  Izquierdo', x: 23, y: 167, width: 30, height: 30 },
  { id: 2, name: 'Índice  Izquierdo', x: 100, y: 55, width: 20, height: 30 },
  { id: 3, name: 'Pulgar  Derecho', x: 468, y: 167, width: 30, height: 30 },
  { id: 4, name: 'Indice  Derecho', x: 400, y: 55, width: 20, height: 30 },
];

const SELECTED = 'rgba(0, 255, 0, 0.5)';
const UNSELECTED = 'rgba(255, 0, 0, 0.4)';
const HOVER = 'rgba(128, 128, 128, 0.6)';

const drawAndPaintFingers = (area: Area, ctx: CanvasRenderingContext2D, color: string) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  if (area.id == 1 || area.id == 3) {
    ctx.ellipse(
      area.x + area.width / 2,
      area.y + area.height / 2,
      (area.width / 2) * 1.2,
      (area.height / 2) * 0.7,
      0,
      0,
      2 * Math.PI,
    );
  } else {
    ctx.ellipse(
      area.x + area.width / 2,
      area.y + area.height / 2,
      area.width / 2,
      area.height / 2,
      0,
      0,
      2 * Math.PI,
    );
  }
  ctx.fill();
};

const checkActionArea = (area: Area, x: number, y: number) => {
  const dx = x - (area.x + area.width / 2);
  const dy = y - (area.y + area.height / 2);
  return (
    (dx * dx) / ((area.width / 2) * (area.width / 2)) +
      (dy * dy) / ((area.height / 2) * (area.height / 2)) <=
    1
  );
};

export default function Hands() {
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [hoverArea, setHoverArea] = useState<number | null>(null);

  useEffect(() => {
    const img = document.getElementById('hands') as HTMLImageElement | null;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const ctx = canvas!.getContext('2d') as CanvasRenderingContext2D | null;

    const handleCanvasClick = (event: MouseEvent) => {
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.fillStyle = SELECTED;

        AREAS.forEach((area: Area) => {
          if (checkActionArea(area, x, y)) {
            apiClientBiometric
              .GET('api/biometrico/capturar/huella')
              .then((response: any) => {
                setSelectedAreas((prev) => [...prev, area.id]);
              })
              .catch((error: any) => {
                throw error;
              });
          }
        });
      }
    };
    const drawAreas = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        AREAS.forEach((area: Area) => {
          const color = selectedAreas.includes(area.id) ? SELECTED : UNSELECTED;
          drawAndPaintFingers(area, ctx, color);
        });
        if (hoverArea !== null) {
          const hoverAreaObj = AREAS.find((area) => area.id === hoverArea);
          if (hoverAreaObj) {
            drawAndPaintFingers(hoverAreaObj, ctx, HOVER);
          }
        }
      }
    };
    const handleMouseMove = (event: MouseEvent) => {
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        let isHovering = false;
        AREAS.forEach((area: Area) => {
          if (checkActionArea(area, x, y)) {
            setHoverArea(area.id);
            isHovering = true;
          }
        });
        if (!isHovering) {
          setHoverArea(null);
        }

        canvas.style.cursor = isHovering ? 'pointer' : 'default';
      }
    };
    const initializeCanvas = () => {
      if (canvas && img && ctx) {
        canvas.width = img.width;
        canvas.height = img.height;

        drawAreas();
        canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener('mousemove', handleMouseMove);
      }
    };
    if (img)
      if (img.complete) initializeCanvas();
      else img.onload = () => initializeCanvas();

    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [selectedAreas, hoverArea]);

  return (
    <>
      <Image id="hands" src={hands} alt="hands" width={500} height={300} className="relative" />
      <canvas id="canvas" className="absolute top-5 left-4" />
    </>
  );
}
