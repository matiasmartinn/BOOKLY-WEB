import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box } from '@mantine/core';
import { isApiError } from 'app/api';
import { useMemo, useState, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { findOverlappingScheduleDay } from 'features/schedules/utils/schedules.utils';
import { useServiceTypes } from 'features/service-types/hooks';
import type { BusinessDto } from 'shared/models';
import { useAuthStore } from 'store/use-auth-store';

import { useCreateBusiness } from '../../hooks/use-create-business';
import { WizardLeftPanel } from '../business-wizard-left-panel';
import { WizardRightPanel } from '../business-wizard-right-panel';
import { BUSINESS_WIZARD_STEPS } from '../components/business-wizard-step';
import { BasicInfoStep, ConfirmStep, SchedulesStep } from '../components/steps';
import { createBusinessSchema, stepSchemas, type CreateBusinessFormValues } from '../schema';

const STEP_COMPONENTS: Partial<Record<string, ReactNode>> = {
  basic: <BasicInfoStep />,
  schedules: <SchedulesStep />,
};

const STEP_VALIDATION_KEYS: Partial<Record<string, keyof typeof stepSchemas>> = {
  basic: 'basic',
  schedules: 'schedules',
};

interface BusinessWizardProps {
  onComplete: (createdService: BusinessDto) => void | Promise<void>;
  onCancel: () => void;
}

const OVERLAPPING_SCHEDULES_MESSAGE = 'Hay horarios superpuestos en el mismo dia.';
const MINIMUM_SCHEDULES_MESSAGE = 'Configura al menos un horario de atencion.';

function getCreateServiceErrorMessage(error: unknown) {
  if (isApiError(error) && error.detail.trim().length > 0) {
    return error.detail;
  }

  return 'No se pudo crear el servicio.';
}

export function BusinessWizardContainer({ onComplete, onCancel }: BusinessWizardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const authUser = useAuthStore((s) => s.user);

  const { mutateAsync: createService, isPending, isError, error } = useCreateBusiness();
  const { data: serviceTypes = [] } = useServiceTypes();

  const methods = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      description: '',
      phoneNumber: '',
      slug: '',
      serviceTypeId: undefined,
      durationMinutes: undefined,
      price: undefined,
      schedules: [],
    },
  });

  const { watch, trigger, getValues, setError, clearErrors } = methods;
  const values = watch();
  const selectedServiceTypeName = useMemo(
    () => serviceTypes.find((serviceType) => serviceType.id === values.serviceTypeId)?.name,
    [serviceTypes, values.serviceTypeId],
  );

  const stepIndex = (id: string) => BUSINESS_WIZARD_STEPS.findIndex((s) => s.id === id);
  const summaries: Record<string, { label: string; value: string }[]> = {
    basic:
      activeIndex > stepIndex('basic') && values.name
        ? [
            { label: 'Nombre', value: values.name },
            {
              label: 'Tipo',
              value: values.serviceTypeId
                ? (selectedServiceTypeName ?? 'Tipo no disponible')
                : '---',
            },
          ]
        : [],
    schedules:
      activeIndex > stepIndex('schedules') && values.schedules?.length
        ? [{ label: 'Horarios', value: `${values.schedules.length} franjas configuradas` }]
        : [],
  };

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

    if (currentStepId === 'schedules') {
      const current = getValues('schedules') ?? [];
      const result = stepSchemas.schedules.safeParse({ schedules: current });

      if (!result.success) {
        setError('schedules', {
          type: 'manual',
          message: MINIMUM_SCHEDULES_MESSAGE,
        });
        return;
      }

      if (findOverlappingScheduleDay(current) !== null) {
        setError('schedules', {
          type: 'manual',
          message: OVERLAPPING_SCHEDULES_MESSAGE,
        });
        return;
      }

      clearErrors('schedules');
    }

    if (activeIndex < BUSINESS_WIZARD_STEPS.length - 1) {
      setActiveIndex((i) => i + 1);
      return;
    }

    await handleSubmit();
  };

  const handleBack = () => {
    if (activeIndex > 0) setActiveIndex((i) => i - 1);
  };

  const handleStepClick = (index: number) => {
    if (index < activeIndex) setActiveIndex(index);
  };

  const handleSubmit = async () => {
    if (!authUser) return;

    const form = getValues();
    const schedules = form.schedules ?? [];

    if (findOverlappingScheduleDay(schedules) !== null) {
      setActiveIndex(stepIndex('schedules'));
      setError('schedules', {
        type: 'manual',
        message: OVERLAPPING_SCHEDULES_MESSAGE,
      });
      return;
    }

    try {
      const createdService = await createService({
        ...form,
        ownerId: authUser.id,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        schedules,
      });

      await onComplete(createdService);
    } catch {
      // El error se muestra inline desde el estado del mutation.
    }
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
          {isError && error && (
            <Alert color="red" variant="light">
              {getCreateServiceErrorMessage(error)}
            </Alert>
          )}

          {activeStep.id === 'confirm' ? (
            <ConfirmStep serviceTypeName={selectedServiceTypeName} />
          ) : (
            STEP_COMPONENTS[activeStep.id]
          )}
        </WizardRightPanel>
      </Box>
    </FormProvider>
  );
}
