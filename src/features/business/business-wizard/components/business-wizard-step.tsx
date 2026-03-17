import { faClock, faFlag, faStore, type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface WizardStep {
  id: string;
  label: string;
  description: string;
  icon: IconDefinition;
  subSteps?: { id: string; label: string }[];
}

export const BUSINESS_WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basic',
    label: 'Información básica',
    description: 'Nombre, rubro y contacto',
    icon: faStore,
    subSteps: [
      { id: 'basic.name', label: 'Nombre y rubro' },
      { id: 'basic.contact', label: 'Contacto' },
    ],
  },
  {
    id: 'schedules',
    label: 'Horarios',
    description: 'Días y rangos de atención',
    icon: faClock,
    subSteps: [
      { id: 'schedules.days', label: 'Días de atención' },
      { id: 'schedules.ranges', label: 'Rangos horarios' },
      { id: 'schedules.duration', label: 'Duración y anticipación' },
    ],
  },
  {
    id: 'confirm',
    label: 'Confirmar',
    description: 'Revisá y publicá tu servicio',
    icon: faFlag,
  },
];
