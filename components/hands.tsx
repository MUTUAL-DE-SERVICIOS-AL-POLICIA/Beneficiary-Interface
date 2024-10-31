'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClientBiometric } from '@/services';
import Image from 'next/image';
import hands from '@/public/hands1.png';

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  group: string;
}

interface HandsProps {
  withDetails: boolean
  selectedOption: string | undefined
  fingerprints: any[]
}

const AREAS: Area[] = [
  { id: 1, name: 'Pulgar Derecho', x: 565, y: 262, width: 30, height: 30, group: 'Pulgares' },
  { id: 2, name: 'Índice Derecho', x: 497, y: 143, width: 20, height: 30, group: 'Indices' },
  { id: 3, name: 'Pulgar Izquierdo', x: 105, y: 262, width: 30, height: 30, group: 'Pulgares' },
  { id: 4, name: 'Índice Izquierdo', x: 183, y: 143, width: 20, height: 30, group: 'Indices' },
];

const NOPROCESS = 'rgba(255, 255, 255, 1)'
const HOVER = 'rgba(0, 90, 255, 0.4)';

const colors = {
  PROCESS: 'rgba(255, 255, 0, 0.5)',
  REGISTERED: 'rgba(0, 255, 0, 0.5)',
  UNREGISTERED: 'rgba(255, 0, 0, 0.4)',
}

const LINE_COLOR = 'gray'
const LINE_WIDTH = 2

const MARKER_COLOR = 'gray'
const MARKER_SIZE = 4


const checkActionArea = (area: Area, x: number, y: number) => {
  const dx = x - (area.x + area.width / 2);
  const dy = y - (area.y + area.height / 2);
  return (
    (dx * dx) / ((area.width / 2) * (area.width / 2)) +
    (dy * dy) / ((area.height / 2) * (area.height / 2)) <=
    1
  );
};

const drawTextOnCanvas = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
  ctx.font = "500 20px 'Courier New'"
  ctx.fillStyle = "black"
  ctx.fillText(text, x, y)
}

const drawLineMarker = (ctx: CanvasRenderingContext2D, startX: number, startY: number, diagonalEndX: number, diagonalEndY: number, horizontalEndX: number,) => {
  ctx.strokeStyle = LINE_COLOR
  ctx.lineWidth = LINE_WIDTH
  ctx.beginPath()
  // Parte diagonal
  ctx.moveTo(startX, startY)
  ctx.lineTo(diagonalEndX, diagonalEndY)

  // Parete horizontal
  ctx.lineTo(diagonalEndX, horizontalEndX)
  ctx.stroke()
}

const drawMaker = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = MARKER_COLOR
  ctx.beginPath()
  ctx.arc(x, y, MARKER_SIZE, 0, 2 * Math.PI)
  ctx.fill()
}

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y); // Mover a la esquina superior izquierda
  ctx.lineTo(x + width - radius, y); // Línea superior
  ctx.arcTo(x + width, y, x + width, y + radius, radius); // Esquina superior derecha
  ctx.lineTo(x + width, y + height - radius); // Línea derecha
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Esquina inferior derecha
  ctx.lineTo(x + radius, y + height); // Línea inferior
  ctx.arcTo(x, y + height, x, y + height - radius, radius); // Esquina inferior izquierda
  ctx.lineTo(x, y + radius); // Línea izquierda
  ctx.arcTo(x, y, x + radius, y, radius); // Esquina superior izquierda
  ctx.closePath();
}

const drawTextBox = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, status: string) => {
  ctx.font = "600 10px 'DejaVu Sans'";
  const padding = 5
  const boxWidth = 160
  const boxHeight = 70
  const radius = 5

  ctx.fillStyle = "white"
  drawRoundedRect(ctx, x - 50, y, boxWidth - 50, boxHeight, radius);
  ctx.fill()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 1
  drawRoundedRect(ctx, x - 50, y, boxWidth - 50, boxHeight, radius);
  ctx.stroke()
  ctx.font = "600 11px 'DejaVu Sans'";
  ctx.fillStyle = "black"
  ctx.fillText(text, (x - 50) + padding, y + 20)
  ctx.font = "11px 'DejaVu Sans'";
  ctx.fillStyle = "black"
  ctx.fillText("Estado:", (x - 50) + padding, y + 35)
  ctx.font = "600 10px 'DejaVu Sans'";
  if(status == 'Registrado') {
    ctx.fillStyle = "green"
  } else if(status == 'No Registrado') {
    ctx.fillStyle = "red"
  } else {
    ctx.fillStyle = "rgba(255, 165, 0, 1)"
  }
  ctx.fillText(status, (x - 35) + padding, y + 50)
}

const drawLineMarkerWithBox = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  diagonalEndX: number,
  diagonalEndY: number,
  horizontalEndX: number,
  text: string,
  status: string
) => {
  drawLineMarker(ctx, startX, startY, diagonalEndX, diagonalEndY, horizontalEndX);
  drawTextBox(ctx, diagonalEndX, horizontalEndX - 30, text, status)
}


export default function Hands(props: HandsProps) {

  const { withDetails, selectedOption, fingerprints } = props

  const [ selectedAreas, setSelectedAreas ] = useState<number[]>([]);
  const [ hoverArea, setHoverArea ] = useState<number | null>(null);

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
  }

  const drawLegend = (ctx: CanvasRenderingContext2D, x: number, y:number, color: string, text:string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 40, 10);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.3;
    ctx.strokeRect(x, y, 40, 10);
    ctx.font = "500 11px 'Courier New'";
    ctx.fillStyle = "black";
    ctx.fillText(text, x+45, y+9);
  }

  const draw = (areas: any, ctx:CanvasRenderingContext2D, color: string, status: string) => {
    areas.forEach((area: Area) => {
      drawAndPaintFingers(area, ctx, color)
      const centerX = area.x + area.width / 2
      const centerY = area.y + area.height / 2
      if (withDetails) {
        drawMaker(ctx, centerX, centerY)
        switch (area.name) {
          case 'Pulgar Derecho':
            drawLineMarkerWithBox(ctx, centerX, centerY, centerX + 50, 250, centerX - 380, area.name, status)
            break;
          case 'Índice Derecho':
            drawLineMarkerWithBox(ctx, centerX, centerY, centerX + 50, 120, centerX - 430, area.name, status)
            break;
          case 'Pulgar Izquierdo':
            drawLineMarkerWithBox(ctx, centerX, centerY, centerX - 50, 250, centerX + 80, area.name, status)
            break;
          case 'Índice Izquierdo':
            drawLineMarkerWithBox(ctx, centerX, centerY, centerX - 50, 120, centerX - 120, area.name, status)
            break;
        }
      } else {
        const hoverAreaObj = AREAS.find((area) => area.id === hoverArea)
        switch (area.name) {
          case 'Pulgar Derecho':
            if (hoverArea !== null && hoverArea == 1) {
              if (hoverAreaObj) {
                drawMaker(ctx, area.x + area.width / 2, area.y + area.height / 2)
                drawLineMarkerWithBox(ctx, centerX, centerY, centerX + 50, 250, centerX - 380, area.name, status)
              }
            }
            break;
          case 'Índice Derecho':
            if (hoverArea !== null && hoverArea == 2) {
              if (hoverAreaObj) {
                drawMaker(ctx, area.x + area.width / 2, area.y + area.height / 2)
                drawLineMarkerWithBox(ctx, centerX, centerY, centerX + 50, 120, centerX - 430, area.name, status )
              }
            }
            break;
          case 'Pulgar Izquierdo':
            if (hoverArea !== null && hoverArea == 3) {
              if (hoverAreaObj) {
                drawMaker(ctx, area.x + area.width / 2, area.y + area.height / 2)
                drawLineMarkerWithBox(ctx, centerX, centerY, centerX - 50, 250, centerX + 80, area.name, status)
              }
            }
            break;
          case 'Índice Izquierdo':
            if (hoverArea !== null && hoverArea == 4) {
              if (hoverAreaObj) {
                drawMaker(ctx, area.x + area.width / 2, area.y + area.height / 2)
                drawLineMarkerWithBox(ctx, centerX, centerY, centerX - 50, 120, centerX - 120, area.name, status)
              }
            }
            break;
        }
      }
    });
    if (hoverArea !== null) {
      const hoverAreaObj = AREAS.find((area) => area.id === hoverArea);
      if (hoverAreaObj) {
        drawAndPaintFingers(hoverAreaObj, ctx, HOVER);
        // drawAndPaintFingers();
      }
    }
  }

  useEffect(() => {
    const img = document.getElementById('hands') as HTMLImageElement | null;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const ctx = canvas!.getContext('2d') as CanvasRenderingContext2D | null;

    const handleCanvasClick = (event: MouseEvent) => {
      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.fillStyle = colors['REGISTERED'];

        AREAS.forEach((area: Area) => {
          if (checkActionArea(area, x, y)) {
            apiClientBiometric
              .GET('api/biometrico/capturar/huella')
              .then((response: any) => {
                console.log(response)
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
        ctx.clearRect(0, 0, canvas!.width, canvas!.height); // borrar dibujo
        // ctx, "text", "x", "y"
        drawTextOnCanvas(ctx, "MANO IZQUIERDA", 160, 440)
        drawTextOnCanvas(ctx, "MANO DERECHA", 390, 440)

        // Dibujar leyenda
        drawLegend(ctx, 20, 450, colors['REGISTERED'], 'REGISTRADO')
        drawLegend(ctx, 20, 465, colors['UNREGISTERED'], 'NO REGISTRADO')
        drawLegend(ctx, 20, 480, colors['PROCESS'], 'EN PROCESO')

        const registeredFootprints:Area[] = AREAS.filter(item1 =>
          fingerprints.some(item2 => item2.id === item1.id)
        )
        draw(registeredFootprints, ctx, colors['REGISTERED'], 'Registrado')
        const unregisteredFootprints:Area[] = AREAS.filter(item1 =>
          !fingerprints.some(item2 => item2.id === item1.id)
        )
        draw(unregisteredFootprints, ctx, colors['UNREGISTERED'], 'No Registrado')
        let selectedFootprints:Area[] = []
        if(selectedOption) {
          if(selectedOption == 'Pulgares' || selectedOption == 'Indices') {
            selectedFootprints = AREAS.filter(item => item.group == selectedOption)
          } else {
            selectedFootprints = AREAS.filter(item => item.id.toString() == selectedOption)
          }
          draw(selectedFootprints, ctx, NOPROCESS, '')
          draw(selectedFootprints, ctx, colors['PROCESS'], 'En proceso')
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
        canvas.width = img.width + 200;
        canvas.height = img.height + 200;

        drawAreas();
        // canvas.addEventListener('click', handleCanvasClick);
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
  }, [selectedAreas, hoverArea, withDetails, selectedOption, fingerprints.length]);

  return (
    <div className="relative flex justify-center items-center mx-auto">
      <Image id="hands" src={hands} alt="hands" width={500} height={300} />
      <canvas id="canvas" className="absolute" style={{ border: "1px solid black", borderRadius: "10px" }} />
    </div>
  );
}
