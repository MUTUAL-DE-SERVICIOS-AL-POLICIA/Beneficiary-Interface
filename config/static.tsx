import {
  faCircleDollarToSlot,
  faFingerprint,
  faHeartPulse,
  faListCheck,
  faMoneyBill,
  faPeopleGroup,
  faPhotoFilm,
  faPiggyBank,
  faPuzzlePiece,
  faRibbon,
  faUserNurse,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Column } from '@/components/table';

interface SubMenuItem {
  key: string | number;
  icon?: JSX.Element;
  title: string;
  topTitle?: string;
  path: string;
}

export interface SidebarItem {
  title: string;
  topTitle: string;
  subMenu?: SubMenuItem[];
  description: string;
  icon?: React.ReactNode;
  customKey: string | number;
  path: string;
}

interface SidebarConfig {
  sidebarItems: SidebarItem[];
}

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Beneficiaries',
  description: 'Página de beneficiarios',
};

export const beneficiaryTableHeaders: Column[] = [
  { id: 1, name: 'PRIMER NOMBRE', key: 'first_name', sortable: true },
  { id: 2, name: 'SEGUNDO NOMBRE', key: 'second_name', sortable: true },
  { id: 3, name: 'APELLIDO PATERNO', key: 'last_name', sortable: true },
  { id: 4, name: 'APELLIDO MATERNO', key: 'mothers_last_name', sortable: true },
  { id: 5, name: 'CARNET IDENTIDAD', key: 'identity_card', sortable: true },
  { id: 6, name: 'GENERO', key: 'gender' },
  { id: 7, name: 'ACCION', key: 'actions' },
];

export const sidebarConfig: SidebarConfig = {
  sidebarItems: [
    {
      topTitle: 'Datos generales de la persona',
      title: 'DATOS DE LA PERSONA',
      description: 'Información general',
      customKey: 'menu-1',
      icon: <FontAwesomeIcon size="lg" icon={faUserTie} />,
      path: '',
      subMenu: [
        {
          title: 'FOTOGRAFIAS',
          key: 'photo',
          icon: <FontAwesomeIcon icon={faPhotoFilm} />,
          path: '/photos'
        },
        {
          title: 'HUELLAS',
          key: 'finger',
          icon: <FontAwesomeIcon icon={faFingerprint} />,
          path: '/fingerprints'
        },
      ],
    },
    {
      topTitle: 'Datos especificos como policía',
      title: 'DATOS DE POLICIA',
      description: 'Datos especificos de policía',
      customKey: 'menu-2',
      icon: <FontAwesomeIcon size="lg" icon={faUserNurse} />,
      path: '/affiliate-data'
    },
    {
      topTitle: 'Listado de los beneficiarios',
      title: 'BENEFICIARIOS',
      description: 'Listado de beneficiarios',
      icon: <FontAwesomeIcon size="lg" icon={faPeopleGroup} />,
      customKey: 'menu-3',
      path: ''
    },
    {
      topTitle: 'Listado de aportes',
      title: 'APORTES',
      description: 'Listado de aportes',
      icon: <FontAwesomeIcon size="lg" icon={faCircleDollarToSlot} />,
      customKey: 'menu-4',
      path: ''
    },
    {
      topTitle: 'Trámites realizados',
      title: 'TRÁMITES REALIZADOS',
      description: 'Trámites realizados',
      icon: <FontAwesomeIcon size="lg" icon={faListCheck} />,
      customKey: 'menu-5',
      path: '',
      subMenu: [
        {
          topTitle: 'Trámites de',
          title: 'FONDO DE RETIRO',
          key: 'FR',
          icon: <FontAwesomeIcon size="lg" icon={faPiggyBank} />,
          path: ''
        },
        {
          topTitle: 'Trámites de',
          title: 'COMPLEMENTO ECONÓMICO',
          key: 'CE',
          icon: <FontAwesomeIcon size="lg" icon={faPuzzlePiece} />,
          path: ''
        },
        {
          topTitle: 'Trámites de',
          title: 'AUXILIO MORTUORIO',
          key: 'AM',
          icon: <FontAwesomeIcon size="lg" icon={faHeartPulse} />,
          path: ''
        },
        {
          topTitle: 'Trámites de',
          title: 'CUOTA MORTUORIA',
          key: 'CM',
          icon: <FontAwesomeIcon size="lg" icon={faRibbon} />,
          path: ''
        },
        {
          topTitle: 'Trámites de',
          title: 'PRÉSTAMOS',
          key: 'PR',
          icon: <FontAwesomeIcon size="lg" icon={faMoneyBill} />,
          path: ''
        },
      ],
    },
  ],
};
