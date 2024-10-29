"use client"
import Hands from "@/components/hands";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import { useState } from "react";

export default function FingerPrintPage () {
  const [isSelected, setIsSelected] = useState(false)
  return (
    <div className="w-full">
      <div className="flex justify-center space-x-4 py-4">
        <Switch isSelected={isSelected} onValueChange={setIsSelected} color="default">Mostrar detalles</Switch>
        <Button>Registrar una huella</Button>
        <Button>Registrar dos huellas</Button>
        <Button>Comparar huella</Button>
      </div>
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="flex justify-center w-full max-w-[500px]">
          <Hands withDetails={isSelected} />
        </div>
      </div>
      <div className="flex justify-center space-x-4 py-4">
        Sección de información aca va ir toda la información de la huella
      </div>
    </div>
  )
}