import { Box } from '@mantine/core';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from 'store/use-auth-store';
import { createBusinessSchema, stepSchemas, type CreateBusinessFormValues } from './schema';
import { WizardLeftPanel } from './business-wizard-left-panel';
import { WizardRightPanel } from './business-wizard-right-panel';
import { BasicInfoStep, ConfirmStep, SchedulesStep } from './components/steps';
import { useCreateBusiness } from './business.hook';
import { BUSINESS_WIZARD_STEPS } from './components/business-wizard-step';

const STEP_COMPONENTS: Partial<Record<string, React.ReactNode>> = {
  basic: <BasicInfoStep />,
  schedules: <SchedulesStep />,
  confirm: <ConfirmStep />,
};

const STEP_VALIDATION_KEYS: Partial<Record<string, keyof typeof stepSchemas>> = {
  basic: 'basic',
  schedules: 'schedules',
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

  const stepIndex = (id: string) => BUSINESS_WIZARD_STEPS.findIndex((s) => s.id === id);
  const summaries: Record<string, { label: string; value: string }[]> = {
    basic:
      activeIndex > stepIndex('basic') && values.name
        ? [
            { label: 'Nombre', value: values.name },
            { label: 'Tipo', value: values.serviceTypeId ? `Tipo ${values.serviceTypeId}` : '—' },
          ]
        : [],
    schedules:
      activeIndex > stepIndex('schedules') && values.schedules?.length
        ? [{ label: 'Horarios', value: `${values.schedules.length} franjas configuradas` }]
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
