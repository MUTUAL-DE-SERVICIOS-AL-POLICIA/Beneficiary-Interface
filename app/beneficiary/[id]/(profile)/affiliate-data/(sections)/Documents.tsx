'use client';
import { apiClient } from '@/services';
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '@nextui-org/theme';
import React from 'react';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalComponent from '@/components/modal';

interface AffiliateDocumentsProps {
  affiliate: any;
  documents: any;
}

export const AffiliateDocuments = React.memo(
  ({ affiliate, documents }: AffiliateDocumentsProps) => {
    const [groupSelected, setGroupSelected] = useState<any>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDocumentId, setCurrentDocumentId] = useState(null);
    const toggleDialog = () => setIsDialogOpen(!isDialogOpen);
    const hasNoDocuments = useMemo(() => documents && documents.status, [documents]);

    const handleDocumentDownload = useCallback(
      async (documentId: any) => {
        if (typeof window !== 'undefined' && affiliate) {
          const printJS = (await import('print-js')).default;
          const response = await apiClient.GET(
            `/api/affiliates/${affiliate.id}/documents/${documentId}`,
          );
          const pdfBlob = await response.blob();
          const pdfURL = URL.createObjectURL(pdfBlob);
          printJS({ printable: pdfURL, type: 'pdf', showModal: true });
          URL.revokeObjectURL(pdfURL);
        } else {
          alert('sin id');
        }
      },
      [affiliate],
    );
    const handleDocumentUpdate = async (documentId: any) => {
      setCurrentDocumentId(documentId);
      toggleDialog();
    };

    const uploadFile = async (file: any) => {
      try {
        const response = await apiClient.POST(
          `/api/affiliates/${affiliate.id}/document/${currentDocumentId}/createOrUpdate`,
          {
            documentPdf: file,
          },
        );
        console.log(response);
        toggleDialog();
        alert('Todo fue correcto');
      } catch (e: any) {
        console.error('Error al cargar el archivo');
      }
    };

    return (
      <div className="flex flex-col w-full">
        {!hasNoDocuments ? (
          <div className="flex items-center justify-center text-center h-full w-full">
            <fieldset className="border border-gray-400 rounded-md py-10 w-full">
              <legend> </legend>
              <span className="">Sin documentos</span>
            </fieldset>
          </div>
        ) : (
          <CheckboxGroup
            value={groupSelected}
            onChange={setGroupSelected}
            classNames={{ base: 'w-full' }}
          >
            {documents.documentsAffiliate.length >= 0 &&
              documents.documentsAffiliate.map((document: any) => (
                <Checkbox
                  key={document.procedureDocumentId}
                  value={document.procedureDocumentId}
                  color="default"
                  size="lg"
                  radius="sm"
                  classNames={{
                    base: cn(
                      'inline-flex max-w-full w-full bg-content1 m-0 border-gray-400',
                      'hover:bg-content3 dark:hover:border-lime-400 bg-content2 items-center justify-start',
                      'cursor-pointer rounded-lg gap-2 p-4 border',
                      'data-[selected=true]:border',
                    ),
                    label: 'w-full',
                  }}
                  defaultSelected
                  // onValueChange={(isSelected) => {
                  //   if (isSelected) {
                  //     handleDownloadDocument(document.procedureDocumentId);
                  //   }
                  // }}
                >
                  <div className="w-full flex justify-between gap-3">
                    <span className="text-sm uppercase">
                      {document.name}
                      <b>&nbsp;({document.shortened})</b>
                    </span>
                    <div className="flex flex-row items-end gap-1">
                      <button
                        onClick={() => handleDocumentDownload(document.procedureDocumentId)}
                        className="p-1"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleDocumentUpdate(document.procedureDocumentId)}
                        className="p-1"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </div>
                  </div>
                </Checkbox>
              ))}
          </CheckboxGroup>
        )}
        <ModalComponent open={isDialogOpen} onOpenChange={toggleDialog} uploadFile={uploadFile} />
      </div>
    );
  },
);
