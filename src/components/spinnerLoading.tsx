import { Spinner } from "@heroui/react";

interface Props {
  isLoading: boolean;
  isTextTop?: boolean;
  isTextSpinner?: boolean;
  isTextBottom?: boolean;
  notSpinner?: boolean;
  labelTop?: string;
  labelSpinner?: string;
  labelBottom?: string;
  topTextTop?: string;
  topSpinner?: string;
  topTextBottom?: string;
}

export const SpinnerLoading = ({
  isLoading = false,
  isTextTop = false,
  isTextSpinner = false,
  isTextBottom = false,
  notSpinner = false,
  labelTop,
  labelSpinner,
  labelBottom,
  topTextTop = "top-[15%]",
  topSpinner = "top-[50%]",
  topTextBottom = "top-[65%]",
}: Props) => {
  if (!isLoading) return null;

  const sharedClass = "absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50";
  const textStyle =
    "text-2xl font-semibold text-default-900 bg-white dark:bg-black rounded-sm min-w-[1000px] text-center";

  return (
    <>
      {isTextTop && (
        <div className={`${sharedClass} ${topTextTop}`}>
          <span className={textStyle}>{labelTop}</span>
        </div>
      )}

      {!notSpinner && (
        <div className={`${sharedClass} ${topSpinner}`}>
          <div className="flex flex-col items-center gap-2">
            <Spinner color="success" size="lg" />
            {isTextSpinner && <span className="text-sm text-muted">{labelSpinner}</span>}
          </div>
        </div>
      )}

      {isTextBottom && (
        <div className={`${sharedClass} ${topTextBottom}`}>
          <span className={textStyle}>{labelBottom}</span>
        </div>
      )}
    </>
  );
};
