"use client"
import Hands from "@/components/hands";
import { apiClient, apiClientBiometric } from "@/services";
import { CircularProgress } from "@nextui-org/progress";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Fingerprint {
  fingerprintTypeId: number
  wsq: string
  quality: number
}

const fingerprintRegistrationOptions = [
  { key: 'Pulgares', name: 'Registrar los pulgares'},
  { key: 'Indices', name: 'Registrar los indices'}
]

export default function FingerPrintPage () {
  const [ isSelected, setIsSelected ] = useState<boolean>(true)
  const [ selectedTwoFinger, setSelectedTwoFinger ] = useState<string | undefined>(undefined)
  const [ selectedOneFinger, setSelectedOneFinger ] = useState<string | undefined>(undefined)
  const [ registeredFingerprints, setRegisteredFingerprints ] = useState([])
  const [ fingerprintIds, setFingerprintIds] = useState([])

  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ progress, setProgress ] = useState(0)

  const { id }  = useParams()
  const personId = parseInt(Array.isArray(id) ? id[0] : id, 10)

  const getRegisteredFingerprints = async () => {
    const response = await apiClient.GET(`/api/persons/showPersonFingerprint/${id}`)
    const data = await response.json()
    setRegisteredFingerprints(data.fingerprints)
  }

  const getFingerprintIds = async () => {
    const response = await apiClient.GET(`/api/persons/showListFingerprint`)
    const data = await response.json()
    setFingerprintIds(data)
  }

  const captureTwoFingerPrints = async () => {
    const response = await apiClientBiometric.GET(`/api/biometrico/capturar/huellas`)
    const { data } = await response.json()
    return data
  }
  const captureOneFingerPrint = async () => {
    const response = await apiClientBiometric.GET(`/api/biometrico/capturar/huella`)
    const { data } = await response.json()
    return data
  }

  const registerFingerPrints = async (fingerprints: any) => {
    const response = await apiClient.POST('/api/persons/createPersonFingerprint', {
      personId,
      fingerprints
    })
    const data = await response.json()
    console.log(data)
  }

  const createFingerprint = (fingerTypeName: string, wsq: string, quality: number): Fingerprint | undefined => {
    const finger:any = fingerprintIds.find((finger:any) => finger.name.includes(fingerTypeName))
    return finger ? { fingerprintTypeId: finger.id, wsq, quality }: undefined
  }

  const handleTwoFingersSelected = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTwoFinger(e.target.value)
    setProgress(0)
    setIsLoading(true)
    try {
      const interval = setInterval(() => {
        setProgress((prev)=> (prev >= 85 ? prev : prev + 1))
      }, 100)
      const response = await captureTwoFingerPrints()
      if(response ) {
        const { izquierda, derecha } = response
        const isThumb = e.target.value === "Pulgares"
        const leftFingerName = isThumb ? 'Pulgar Izquierdo' : 'Índice Izquierdo'
        const rightFingerName = isThumb ? 'Pulgar Derecho' : 'Índice Derecho'

        if(izquierda && derecha ) {
          const fingerprints: Fingerprint[] = [
            createFingerprint(leftFingerName, izquierda.wsq, derecha.quality),
            createFingerprint(rightFingerName, izquierda.wsq, derecha.quality)
          ].filter(Boolean) as Fingerprint[]
          await registerFingerPrints(fingerprints)
          clearInterval(interval)
          setProgress(100)
          await getRegisteredFingerprints()
          setSelectedTwoFinger(undefined)
        } else {
          console.log("vuelve a intentarlo")
        }
      }
    } catch(e:any) {

    } finally {
      setTimeout(() => {
        setSelectedTwoFinger(undefined)
        setIsLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  const handleOneFingerSelect = async (e:any) => {
    const fingerprintTypeId = parseInt(e.target.value, 10)
    setSelectedOneFinger(e.target.value)
    setProgress(0)
    setIsLoading(true)
    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 85 ? prev : prev + 1))
      }, 100)
      const { wsq, quality} = await captureOneFingerPrint()
      const body = [{ fingerprintTypeId, wsq, quality }]
      await registerFingerPrints(body)
      clearInterval(interval)
      setProgress(100)
      await getRegisteredFingerprints()
      setSelectedOneFinger(undefined)
    } catch (e:any) {
      console.log(e)
    } finally  {
      setTimeout(() => {
        setSelectedOneFinger(undefined)
        setIsLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  useEffect(() => {
    getRegisteredFingerprints()
    getFingerprintIds()
  }, [])

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-4 py-4">
        <Switch
          isSelected={isSelected}
          onValueChange={setIsSelected}
          color="default"
        >
          Mostrar detalles
        </Switch>
        <Select
          size="sm"
          label="Registrar dos huellas"
          className="max-w-[15rem]"
          placeholder="Seleccione una opción"
          value={selectedTwoFinger}
          onChange={handleTwoFingersSelected}
        >
          {fingerprintRegistrationOptions.map((finger) => (
            <SelectItem key={finger.key}>
              {finger.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          size="sm"
          label="Registrar una huella"
          className="max-w-[12rem]"
          placeholder="Seleccione un dedo"
          value={selectedOneFinger}
          onChange={handleOneFingerSelect}
        >
          {
            fingerprintIds.map((finger:any) => (
              <SelectItem key={finger.id}>
                {finger.name}
              </SelectItem>
            ))
          }
        </Select>
      </div>
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="flex justify-center w-full max-w-[500px]">
          { isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 z-10">
              <CircularProgress
                aria-label="Registrando..."
                size="lg"
                value={progress}
                color="success"
                showValueLabel={true}
                classNames={{
                  base: "w-[120px] h-[120px]",
                  svgWrapper: "w-[120px] h-[120px]",
                  svg: "w-full h-full",
                  track: "stroke-[4px]",
                  indicator: "stroke-[4px]",
                  value: "text-lg font-semibold",
                }}
              />
            </div>
          )}
          <Hands
            withDetails={isSelected}
            selectedOption={selectedTwoFinger || selectedOneFinger}
            fingerprints={[...registeredFingerprints]}
          />
        </div>
      </div>
    </div>
  )
}