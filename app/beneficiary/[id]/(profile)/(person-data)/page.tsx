"use client"
import { Button } from "@nextui-org/button"
import { useState } from "react"
import { Divider } from '@nextui-org/divider';

export default function PersonDataPage() {
  const [ isEditing, setIsEditing ] = useState(false)
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm font-bold text-gray-800 uppercase">Datos de la persona</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "bg-green-500 hover:bg-green-600" : "bg-lime-500 hover:bg-lime-600"}
        >
          {isEditing ? "Guardar Cambios" : "Editar Información"}
        </Button>
      </div>
      <Divider/>
    </div>
  )
}