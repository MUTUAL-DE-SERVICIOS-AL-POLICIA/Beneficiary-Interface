import type { Key } from "@heroui/react";

import { Button, Form, Input, Label, ListBox, Modal, ProgressCircle, Select, toast } from "@heroui/react";
import { useState } from "react";

import { createFileDossier, updateFileDossier } from "@/api/affiliate";
import { postUploadChunk } from "@/api/common";
import { usePerson } from "@/context/PersonContext";
import { AffiliateFileDossier, FileDossier as FileDossierInterface } from "@/utils/interfaces";

interface ModalProps {
  onRefreshFileDossiers: () => Promise<void>;
  isOpen?: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  affiliateFileDossier?: AffiliateFileDossier;
  dataRegister?: {
    allData: FileDossierInterface[];
    disableData: Key[];
  } | null;
}

export function ModalRegisterFileDossier({
  onRefreshFileDossiers,
  isOpen,
  onClose,
  isUpdate = false,
  affiliateFileDossier = undefined,
  dataRegister = {
    allData: [],
    disableData: [],
  },
}: ModalProps) {
  const [loadingSave, setLoadingSave] = useState(false);
  const { affiliateId } = usePerson();
  const [fileDossierId, setFileDossierId] = useState<Key | null>(null);
  const [progress, setProgress] = useState(0);
  const registerData = dataRegister ?? { allData: [], disableData: [] };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingSave(true);
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("fileDossierPdf");

      if (!(file instanceof File)) {
        toast.danger("No se ha seleccionado un archivo válido");

        return;
      }

      if (!isUpdate && fileDossierId === null) {
        toast.danger("Selecciona un expediente para continuar");

        return;
      }

      const CHUNK_SIZE = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileId =
        isUpdate && affiliateFileDossier
          ? affiliateFileDossier.fileDossierId.toString()
          : String(fileDossierId);
      const initialName = `fileDossier-${affiliateId}-${fileId}`;
      const uploadVariant = isUpdate && affiliateFileDossier ? "update" : "create";

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunk = file.slice(start, end);

        const body = new FormData();

        body.append("chunk", chunk);
        body.append("nameChunk", initialName + "-" + i);

        const response = await postUploadChunk(body, uploadVariant);

        if (response.error) {
          toast.danger("Error al subir el archivo: " + response.message);

          return;
        }

        const progress = ((i + 1) / totalChunks) * 100;

        setProgress(progress);
      }

      let dataResponse: any = {};

      if (isUpdate && affiliateFileDossier) {
        dataResponse = await updateFileDossier(affiliateId, fileId, initialName, totalChunks);
      } else {
        dataResponse = await createFileDossier(affiliateId, fileId, initialName, totalChunks);
      }

      if (dataResponse.error) {
        toast.danger(dataResponse.message);

        return;
      }

      toast.success(dataResponse.message);
      await onRefreshFileDossiers();
      setFileDossierId(null);
      setProgress(0);
      onClose();
    } catch {
      toast.danger("Error al registrar el expediente");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal>
      <Modal.Backdrop
        isKeyboardDismissDisabled
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Modal.Container size="lg">
          <Modal.Dialog className="w-full max-w-3xl">
            <Form onSubmit={onSubmit}>
              <Modal.Header>
                <Modal.Heading>
                  {loadingSave
                    ? "REGISTRANDO EXPEDIENTE"
                    : isUpdate && affiliateFileDossier
                      ? "ACTUALIZAR EXPEDIENTE"
                      : "SELECCIONE EXPEDIENTE"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                {loadingSave ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <ProgressCircle aria-label="Progreso de carga" color="success" size="md" value={progress}>
                      <ProgressCircle.Track>
                        <ProgressCircle.TrackCircle />
                        <ProgressCircle.FillCircle />
                      </ProgressCircle.Track>
                    </ProgressCircle>
                    <span>{Math.round(progress)}%</span>
                  </div>
                ) : (
                  <>
                    {!isUpdate ? (
                      <Select
                        fullWidth
                        isRequired
                        disabledKeys={registerData.disableData}
                        name="fileDossierId"
                        placeholder="Seleccione un expediente"
                        value={fileDossierId}
                        onChange={(key) => setFileDossierId(Array.isArray(key) ? (key[0] ?? null) : key)}
                      >
                        <Label>Expedientes</Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox aria-label="Expedientes disponibles">
                            {registerData.allData.map((fileDossier) =>
                              fileDossier.id === null ? null : (
                                <ListBox.Item
                                  key={fileDossier.id}
                                  id={fileDossier.id}
                                  textValue={fileDossier.name ?? ""}
                                >
                                  {fileDossier.name}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ),
                            )}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    ) : (
                      <p>
                        {affiliateFileDossier && (
                          <>
                            <b>Nombre:</b> {affiliateFileDossier.name}
                            <br />
                            <b>Código:</b> {affiliateFileDossier.shortened}
                          </>
                        )}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fileDossierPdf">Archivo del expediente</Label>
                      <Input
                        required
                        accept="application/pdf"
                        id="fileDossierPdf"
                        name="fileDossierPdf"
                        type="file"
                      />
                    </div>
                  </>
                )}
              </Modal.Body>
              {!loadingSave && (
                <Modal.Footer>
                  <Button slot="close" variant="secondary">
                    Cerrar
                  </Button>
                  <Button type="submit">Subir</Button>
                </Modal.Footer>
              )}
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
