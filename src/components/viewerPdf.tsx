"use client";

import { useEffect, useMemo } from "react";

interface Props {
  blob: Blob;
}

export const ViewerPdf = ({ blob }: Props) => {
  const pdf = useMemo(() => {
    const objectUrl = URL.createObjectURL(blob);

    return {
      url: `${objectUrl}#toolbar=1&navpanes=0&pagemode=none&scrollbar=0&view=FitH`,
      objectUrl,
    };
  }, [blob]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(pdf.objectUrl);
    };
  }, [pdf]);

  return <iframe className="h-full w-full border-0" src={pdf.url} title="Visor PDF" />;
};
