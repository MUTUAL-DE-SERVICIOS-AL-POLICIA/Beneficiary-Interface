"use client"
import Hands from "@/components/hands";

export default function FingerPrintPage () {
  return (
    <>
      <div className="flex-col">
        <Hands />
      </div>
      <div className="flex-col">
        <h4>Calidad de la imagen</h4>
      </div>
    </>
  )
}