import { businessService } from 'features/business/services/business.service';
import type { BusinessDto, UserModel } from 'shared/models';
import { create } from 'zustand';

type BusinessContextUser = Pick<UserModel, 'id' | 'role' | 'serviceIds'>;

const BUSINESS_ERROR_MESSAGE = 'Ocurrio un error. Intenta nuevamente.';

interface BusinessStore {
  services: BusinessDto[];
  selectedService: BusinessDto | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  initialized: boolean;
  errorMessage: string | null;
  loadServices: (user: BusinessContextUser) => Promise<void>;
  selectService: (id: number) => Promise<void>;
  refreshServices: (user: BusinessContextUser) => Promise<void>;
  updateService: (updated: BusinessDto) => void;
  clearError: () => void;
  clear: () => void;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  isLoadingDetail: false,
  initialized: false,
  errorMessage: null,

  refreshServices: async (user) => {
    try {
      const normalizedRole = user.role.trim().toLowerCase();
      const currentSelectedServiceId = get().selectedService?.id;

      if (normalizedRole === 'owner') {
        const services = await businessService.getByOwner(user.id);
        const nextSelectedServiceId =
          services.find((service) => service.id === currentSelectedServiceId)?.id ?? services[0]?.id;

        if (!nextSelectedServiceId) {
          set({ services, selectedService: null, errorMessage: null });
          return;
        }

        const selectedService = await businessService.getById(nextSelectedServiceId);
        set({ services, selectedService, errorMessage: null });
        return;
      }

      if (normalizedRole === 'secretary') {
        const serviceIds = Array.from(new Set(user.serviceIds)).filter((id) => id > 0);

        if (serviceIds.length === 0) {
          set({ services: [], selectedService: null, errorMessage: null });
          return;
        }

        const services = await Promise.all(
          serviceIds.map((serviceId) => businessService.getById(serviceId)),
        );
        const orderedServices = [...services].sort((left, right) => left.id - right.id);
        const nextSelectedService =
          orderedServices.find((service) => service.id === currentSelectedServiceId) ??
          orderedServices[0] ??
          null;

        set({
          services: orderedServices,
          selectedService: nextSelectedService,
          errorMessage: null,
        });
        return;
      }

      set({ services: [], selectedService: null, errorMessage: null });
    } catch {
      set({ errorMessage: BUSINESS_ERROR_MESSAGE });
    }
  },

  loadServices: async (user) => {
    set({ isLoading: true, initialized: false, errorMessage: null });

    try {
      const normalizedRole = user.role.trim().toLowerCase();
      const currentSelectedServiceId = get().selectedService?.id;

      if (normalizedRole === 'owner') {
        const services = await businessService.getByOwner(user.id);
        set({ services, isLoading: false, initialized: true, errorMessage: null });

        if (services.length > 0) {
          const nextSelectedServiceId =
            services.find((service) => service.id === currentSelectedServiceId)?.id ?? services[0].id;
          await get().selectService(nextSelectedServiceId);
        } else {
          set({ selectedService: null });
        }

        return;
      }

      if (normalizedRole === 'secretary') {
        const serviceIds = Array.from(new Set(user.serviceIds)).filter((id) => id > 0);

        if (serviceIds.length === 0) {
          set({
            services: [],
            selectedService: null,
            isLoading: false,
            initialized: true,
            errorMessage: null,
          });
          return;
        }

        const services = await Promise.all(
          serviceIds.map((serviceId) => businessService.getById(serviceId)),
        );
        const orderedServices = [...services].sort((left, right) => left.id - right.id);
        const nextSelectedService =
          orderedServices.find((service) => service.id === currentSelectedServiceId) ??
          orderedServices[0] ??
          null;

        set({
          services: orderedServices,
          selectedService: nextSelectedService,
          isLoading: false,
          initialized: true,
          errorMessage: null,
        });
        return;
      }

      set({
        services: [],
        selectedService: null,
        isLoading: false,
        initialized: true,
        errorMessage: null,
      });
    } catch {
      set({
        isLoading: false,
        initialized: true,
        errorMessage: BUSINESS_ERROR_MESSAGE,
      });
    }
  },

  selectService: async (id) => {
    set({ isLoadingDetail: true, errorMessage: null });

    try {
      const detail = await businessService.getById(id);
      set({ selectedService: detail, isLoadingDetail: false, errorMessage: null });
    } catch {
      set({ isLoadingDetail: false, errorMessage: BUSINESS_ERROR_MESSAGE });
    }
  },

  updateService: (updated) => {
    set((state) => ({
      services: state.services.map((service) => (service.id === updated.id ? updated : service)),
      selectedService: state.selectedService?.id === updated.id ? updated : state.selectedService,
      errorMessage: null,
    }));
  },

  clearError: () => set({ errorMessage: null }),

  clear: () =>
    set({
      services: [],
      selectedService: null,
      isLoading: false,
      isLoadingDetail: false,
      initialized: false,
      errorMessage: null,
    }),
}));
