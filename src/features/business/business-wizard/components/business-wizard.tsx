import { Box } from '@mantine/core';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  faStore,
  faClock,
  faCalendarCheck,
  faFlag,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import { useAuthStore } from 'store/use-auth-store';
import { ConfigStep } from './steps/config-step';
import { createBusinessSchema, stepSchemas, type CreateBusinessFormValues } from '../schema';
import { WizardLeftPanel } from '../business-wizard-left-panel';
import { WizardRightPanel } from '../business-wizard-right-panel';
import { BasicInfoStep, ConfirmStep } from './steps';
import { useCreateBusiness } from '../business.hook';

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
    description: 'El nombre y el rubro de tu servicio',
    icon: faStore,
    subSteps: [
      { id: 'basic.name', label: 'Nombre y rubro' },
      { id: 'basic.description', label: 'Descripción' },
    ],
  },
  {
    id: 'config',
    label: 'Configuración',
    description: 'Duración de turnos y precio',
    icon: faClock,
    subSteps: [
      { id: 'config.duration', label: 'Duración' },
      { id: 'config.price', label: 'Precio' },
    ],
  },
  {
    id: 'appointments',
    label: 'Turnos',
    description: 'Configuración de reservas online',
    icon: faCalendarCheck,
  },
  {
    id: 'confirm',
    label: 'Confirmar',
    description: 'Revisá y publicá tu servicio',
    icon: faFlag,
  },
];

const STEP_COMPONENTS: Partial<Record<string, React.ReactNode>> = {
  basic: <BasicInfoStep />,
  config: <ConfigStep />,
  confirm: <ConfirmStep />,
};

const STEP_VALIDATION_KEYS: Partial<Record<string, keyof typeof stepSchemas>> = {
  basic: 'basic',
  config: 'config',
};

interface BusinessWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function BusinessWizard({ onComplete, onCancel }: BusinessWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const authUser = useAuthStore((s) => s.user);

  const { mutate: createService, isPending } = useCreateBusiness();

  const methods = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      serviceTypeId: undefined,
      durationMinutes: undefined,
      price: undefined,
      schedules: [],
    },
  });

  const { watch, trigger, getValues, setError } = methods;
  const values = watch();

  const summaries: Record<string, { label: string; value: string }[]> = {
    basic:
      activeIndex > 0 && values.name
        ? [
            { label: 'Nombre', value: values.name },
            { label: 'Tipo', value: values.serviceTypeId ? `Tipo ${values.serviceTypeId}` : '—' },
          ]
        : [],
    config:
      activeIndex > 1 && values.durationMinutes
        ? [
            { label: 'Duración', value: `${values.durationMinutes} min` },
            { label: 'Precio', value: values.price != null ? `$ ${values.price}` : 'A consultar' },
          ]
        : [],
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = async () => {
    const currentStepId = BUSINESS_WIZARD_STEPS[activeIndex].id;
    const schemaKey = STEP_VALIDATION_KEYS[currentStepId];

    if (schemaKey) {
      const fieldsToValidate = Object.keys(
        stepSchemas[schemaKey].shape,
      ) as (keyof CreateBusinessFormValues)[];
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }

    // Validación manual del paso de horarios
    if (currentStepId === 'schedules') {
      const current = getValues('schedules') ?? [];
      const result = stepSchemas.schedules.safeParse({ schedules: current });
      if (!result.success) {
        setError('schedules', {
          type: 'manual',
          message: 'Configurá al menos un horario de atención',
        });
        return;
      }
    }

    if (activeIndex < BUSINESS_WIZARD_STEPS.length - 1) {
      setActiveIndex((i) => i + 1);
      return;
    }

    handleSubmit();
  };

  const handleBack = () => {
    if (activeIndex > 0) setActiveIndex((i) => i - 1);
  };

  const handleStepClick = (index: number) => {
    if (index < activeIndex) setActiveIndex(index);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!authUser) return;

    const form = getValues();

    createService(
      {
        ...form,
        ownerId: authUser.id,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        schedules: form.schedules ?? [],
      },
      { onSuccess: onComplete },
    );
  };

  const activeStep = BUSINESS_WIZARD_STEPS[activeIndex];

  return (
    <FormProvider {...methods}>
      <Box
        style={{
          display: 'flex',
          width: '100%',
          height: '100dvh',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <WizardLeftPanel
          steps={BUSINESS_WIZARD_STEPS}
          activeIndex={activeIndex}
          summaries={summaries}
          onStepClick={handleStepClick}
        />
        <WizardRightPanel
          step={activeStep}
          stepIndex={activeIndex}
          totalSteps={BUSINESS_WIZARD_STEPS.length}
          isLastStep={activeIndex === BUSINESS_WIZARD_STEPS.length - 1}
          isSubmitting={isPending}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={onCancel}
        >
          {STEP_COMPONENTS[activeStep.id]}
        </WizardRightPanel>
      </Box>
    </FormProvider>
  );
}
