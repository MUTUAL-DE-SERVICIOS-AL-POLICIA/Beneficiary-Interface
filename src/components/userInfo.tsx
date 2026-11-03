"use client";
import { useState, useRef, ChangeEvent } from "react";
import { Avatar, Card, Button, Label, Modal, Surface, useOverlayState, toast } from "@heroui/react";

import { CopyButton, ButtonEdition, ButtonRegister, ButtonEdit, ButtonDelete } from "@/components";

interface Props {
  user: {
    fullName: string;
    identityCard: string;
    nup?: string;
    kinship?: string;
    state?: boolean;
  };
  isPolice: boolean;
  isRegister?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  hasPhoto?: boolean;
  onPressRegister?: (file: File | null) => void | Promise<void>;
  onPressEdit?: (file: File | null) => void | Promise<void>;
  onPressDelete?: () => void;
  photoUrl?: string | null;
}

export const UserInfo = ({
  user,
  isPolice,
  isRegister = false,
  isEdit = false,
  isDelete = false,
  hasPhoto = false,
  onPressRegister = () => {},
  onPressEdit = () => {},
  onPressDelete = () => {},
  photoUrl,
}: Props) => {
  const [isEdition, setEdition] = useState(false);
  const state = useOverlayState();
  const [modalMode, setModalMode] = useState<"register" | "edit">("register");

  // Estados y referencias para la cámara y los archivos
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Agrega este estado arriba junto con tus otros useState:
  const [fileName, setFileName] = useState<string | null>(null);

  const switchEdit = () => {
    setEdition(!isEdition);
  };

  const openRegisterModal = () => {
    setModalMode("register");
    state.setOpen(true);
  };

  const openEditModal = () => {
    setModalMode("edit");
    state.setOpen(true);
  };

  // 1. Abrir la cámara (Limpia cualquier archivo previo cargado)
  const startCamera = async () => {
    try {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setCapturedImage(null);
      }
    } catch {
      alert("No se pudo acceder a la cámara. Revisa los permisos del navegador.");
    }
  };

  // 2. Apagar la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;

      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  // Helper para convertir Base64 a File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  // 3. Capturar la foto
  const capturePhoto = (): File | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const width = video.videoWidth;
      const height = video.videoHeight;

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(video, 0, 0, width, height);
        const imageUrl = canvas.toDataURL("image/png");

        setCapturedImage(imageUrl);
        stopCamera();

        return dataURLtoFile(imageUrl, `photo_${Date.now()}.png`);
      }
    }

    return null;
  };

  // Manejador del Input de Archivos
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setSelectedFile(file);
      setFileName(file.name); // <--- Guardamos el nombre para mostrarlo visualmente
      setCapturedImage(null); // Limpiamos foto de cámara si eligió archivo
    } else {
      setFileName(null);
    }
  };

  // Detener la cámara si el modal se cierra o cancela
  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      stopCamera();
    }
    state.setOpen(isOpen);
  };

  // 4. Acción principal al Presionar "Guardar"
  const handleSave = async () => {
    let finalFile: File | null = null;

    // Prioridad 1: Si la cámara está activa, capturamos en el momento
    if (isCameraActive && videoRef.current) {
      finalFile = capturePhoto();
    }
    // Prioridad 2: Si hay una foto ya capturada previamente por la cámara
    else if (capturedImage) {
      finalFile = dataURLtoFile(capturedImage, `photo_${Date.now()}.png`);
    }
    // Prioridad 3: Usamos directamente el archivo que guardamos en el estado al seleccionarlo
    else if (selectedFile) {
      finalFile = selectedFile;
    }
    // Respaldo por si quedó en el input físico del DOM
    else if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
      finalFile = fileInputRef.current.files[0];
    }

    if (!finalFile) {
      toast.danger("Por favor captura una foto o selecciona un archivo.");

      return;
    }

    // Ejecutar la acción según corresponda (Registrar o Editar)
    if (modalMode === "register") {
      await onPressRegister(finalFile);
    } else {
      await onPressEdit(finalFile);
    }

    // Resetear y cerrar modal
    stopCamera();
    setCapturedImage(null);
    setSelectedFile(null);
    setFileName(null); // Limpiamos también el nombre visual
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    state.setOpen(false);
  };

  return (
    <>
      <Card className="justify-center flex border-2 border-default-300 min-w-90 w-full">
        <div className="flex flex-col gap-1 items-center">
          <div className="relative">
            <Avatar className="h-50 w-60 rounded-lg">
              <Avatar.Image
                alt={user.fullName}
                className="h-full w-full object-cover"
                src={photoUrl || (isPolice ? "/svg/police.svg" : "/svg/person.svg")}
              />
            </Avatar>
            <span className="absolute bottom-1 right-1">
              {hasPhoto ? (
                <ButtonEdition isIconOnly isEdit={isEdition} onPress={switchEdit} />
              ) : (
                isRegister && <ButtonRegister isIconOnly onPress={openRegisterModal} />
              )}
            </span>
          </div>
          {isEdition && (
            <div className="flex items-center gap-1">
              {hasPhoto && isEdit && <ButtonEdit onPress={openEditModal} />}
              {hasPhoto && isDelete && <ButtonDelete onPress={onPressDelete} />}
            </div>
          )}
          <h4 className="text-medium font-bold text-default-800 text-pretty text-center uppercase">
            {user?.fullName}
          </h4>
          <div className="flex items-center gap-1 leading-none">
            <p className="font-semibold text-default-800 text-small">C.I.</p>
            <p className="text-default-600 text-small">{user?.identityCard}</p>
            <CopyButton text={user?.identityCard} />
          </div>
          {isPolice && (
            <div className="flex items-center gap-1 leading-none">
              <p className="text-small font-semibold text-default-800">NUP.</p>
              <p className="text-small text-default-600">{user?.nup}</p>
              <CopyButton text={user?.nup} />
            </div>
          )}
          {user?.kinship && (
            <div className="flex items-center gap-1 leading-none">
              <p className="text-small font-semibold text-default-800">{user?.kinship}</p>
            </div>
          )}
          {!user?.state && (
            <p className="text-small text-yellow-600 text-center leading-none">- No vigente -</p>
          )}
        </div>
      </Card>

      {/* MODAL UNIFICADO PARA REGISTRAR / EDITAR FOTO */}
      <Modal>
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={handleModalOpenChange}>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-xl w-full">
              <Modal.CloseTrigger />
              <Modal.Body className="p-6">
                <Surface className="flex flex-col gap-6" variant="default">
                  {/* Opción 1: Archivo local (bloqueado si la cámara está encendida) */}
                  <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1.5">
                      <Label className={`font-semibold text-medium ${isCameraActive ? "opacity-50" : ""}`}>
                        {modalMode === "register" ? "Subir Archivo de Foto" : "Actualizar Archivo de Foto"}
                      </Label>

                      {/* Input de archivo oculto para que no muestre el texto feo del navegador */}
                      <input
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        disabled={isCameraActive}
                        type="file"
                        onChange={handleFileChange}
                      />

                      {/* Botón personalizado que dispara el selector de archivos */}
                      <div className="flex items-center gap-2">
                        <Button
                          className={`w-full h-11 text-medium ${isCameraActive ? "opacity-50" : ""}`}
                          isDisabled={isCameraActive}
                          variant="secondary"
                          onPress={() => fileInputRef.current?.click()}
                        >
                          📂 Seleccionar imagen de archivo
                        </Button>
                      </div>

                      {/* Feedback visual claro y limpio del archivo seleccionado */}
                      {fileName && !isCameraActive && (
                        <div className="flex items-center justify-between bg-default-100 px-3 py-2 rounded-lg text-small text-default-700 mt-1">
                          <span className="truncate">
                            📎 <strong>{fileName}</strong>
                          </span>
                          <button
                            className="text-danger font-bold text-xs hover:underline ml-2"
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFileName(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </div>
                  </form>

                  <hr className="border-default-200" />

                  {/* Opción 2: Cámara */}
                  <div className="flex flex-col gap-4">
                    <Label className="font-semibold text-medium">
                      {modalMode === "register" ? "Sacar Foto con Cámara" : "Nueva Foto con Cámara"}
                    </Label>

                    {/* Visor de Video / Transmisión */}
                    <div className="relative w-full aspect-4/3 min-h-75 sm:min-h-90 bg-black/10 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-default-300">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover ${!isCameraActive ? "hidden" : ""}`}
                      >
                        <track kind="captions" />
                      </video>
                      {!isCameraActive && !capturedImage && (
                        <div className="flex flex-col items-center gap-2 text-default-500 p-4 text-center">
                          <p className="text-medium font-medium">La cámara está apagada</p>
                        </div>
                      )}

                      {capturedImage && !isCameraActive && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          alt="Foto capturada"
                          className="w-full h-full object-cover"
                          src={capturedImage}
                        />
                      )}
                    </div>

                    {/* Canvas oculto para procesar el fotograma */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Controles de la Cámara */}
                    <div className="flex gap-3">
                      {!isCameraActive ? (
                        <Button className="w-full h-11 text-medium" variant="secondary" onPress={startCamera}>
                          {capturedImage ? "Volver a Tomar Foto" : "Encender Cámara"}
                        </Button>
                      ) : (
                        <>
                          <Button className="w-full h-11 text-medium" onPress={capturePhoto}>
                            Capturar
                          </Button>
                          <Button
                            className="w-full h-11 text-medium"
                            variant="secondary"
                            onPress={stopCamera}
                          >
                            Apagar Cámara
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Surface>
              </Modal.Body>
              <Modal.Footer className="px-6 pb-6">
                <Button slot="close" variant="secondary" onPress={stopCamera}>
                  Cancelar
                </Button>
                <Button onPress={handleSave}>{modalMode === "register" ? "Guardar" : "Actualizar"}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};
