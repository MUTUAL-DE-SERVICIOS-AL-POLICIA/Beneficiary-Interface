import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { ReactNode } from "react";

interface ListboxProps {
  customKey: string | number;
  topTitle: string;
  description: string;
  icon: ReactNode;
  title: string;
  onAction?: () => void;
  showDivider?: boolean;
  activeItem: string | number;
}

export const ListboxComponent = (props: ListboxProps) => {
  const { customKey, topTitle, description, icon, title, onAction, showDivider, activeItem } = props;

  const cssListboxSection = {
    base: "m-0 p-0 h-15",
    heading: "text-default-700",
    divider: "h-[2px] bg-default-500 ml-3", // estilos de la barra de división
  };

  const cssListboxItem = "m-0 p-0";

  const cssGeneral = {
    base: "",
    title: "mt-0 mb-0 font-bold text-medium ",
    trigger: "",
    indicator: "text-medium",
  };

  const getListboxClasses = (customKey: string | number): string =>
    `${cssGeneral.title}
      ${cssGeneral.trigger}
      px-3 py-0 rounded-small
      ${activeItem === customKey ? "bg-default-300" : "bg-default-100"}
    `;

  return (
    <Listbox
      aria-label="list box"
      className={getListboxClasses(customKey)}
      variant="flat"
      onAction={onAction}
    >
      <ListboxSection classNames={cssListboxSection} showDivider={showDivider} title={topTitle}>
        <ListboxItem
          key={customKey}
          className={cssListboxItem}
          description={description}
          startContent={icon}
          title={title}
        />
      </ListboxSection>
    </Listbox>
  );
};
