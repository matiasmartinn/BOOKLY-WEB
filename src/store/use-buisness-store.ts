import { businessService } from 'features/business/services/business.service';
import type { BusinessDto, UserModel } from 'shared/models';
import { create } from 'zustand';

type BusinessContextUser = Pick<UserModel, 'id' | 'role' | 'serviceIds'>;

interface BusinessStore {
  services: BusinessDto[];
  selectedService: BusinessDto | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  initialized: boolean;
  /**
   * Carga el listado liviano de servicios del owner.
   * Una vez que llega, pre-selecciona el primero automáticamente
   * fetcheando su detalle completo.
   */
  loadServices: (user: BusinessContextUser) => Promise<void>;

  /**
   * Cambia el servicio activo.
   * Fetchea el detalle completo vía GET /services/{id} antes de setearlo,
   * para que el dashboard siempre trabaje con datos frescos.
   */
  selectService: (id: number) => Promise<void>;

  /**
   * Sincroniza servicios sin disparar el loader global del dashboard.
   * Se usa para refrescos silenciosos del contexto actual.
   */
  refreshServices: (user: BusinessContextUser) => Promise<void>;

  /**
   * Actualización local luego de un PUT — evita re-fetchear toda la lista.
   */
  updateService: (updated: BusinessDto) => void;

  clear: () => void;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  isLoadingDetail: false,
  initialized: false,

  refreshServices: async (user) => {
    try {
      const normalizedRole = user.role.trim().toLowerCase();
      const currentSelectedServiceId = get().selectedService?.id;

      if (normalizedRole === 'owner') {
        const services = await businessService.getByOwner(user.id);
        const nextSelectedServiceId =
          services.find((service) => service.id === currentSelectedServiceId)?.id ?? services[0]?.id;

        if (!nextSelectedServiceId) {
          set({ services, selectedService: null });
          return;
        }

        const selectedService = await businessService.getById(nextSelectedServiceId);
        set({ services, selectedService });
        return;
      }

      if (normalizedRole === 'secretary') {
        const serviceIds = Array.from(new Set(user.serviceIds)).filter((id) => id > 0);

        if (serviceIds.length === 0) {
          set({ services: [], selectedService: null });
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

        set({ services: orderedServices, selectedService: nextSelectedService });
        return;
      }

      set({ services: [], selectedService: null });
    } catch {
      // Silent refreshes should not reset the current dashboard state on transient failures.
    }
  },

  loadServices: async (user) => {
    set({ isLoading: true, initialized: false });
    try {
      const normalizedRole = user.role.trim().toLowerCase();
      const currentSelectedServiceId = get().selectedService?.id;

      if (normalizedRole === 'owner') {
        const services = await businessService.getByOwner(user.id);
        set({ services, isLoading: false, initialized: true });

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
          set({ services: [], selectedService: null, isLoading: false, initialized: true });
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
        });
        return;
      }

      set({ services: [], selectedService: null, isLoading: false, initialized: true });
    } catch {
      set({ services: [], selectedService: null, isLoading: false, initialized: true });
    }
  },

  selectService: async (id) => {
    set({ isLoadingDetail: true });
    try {
      const detail = await businessService.getById(id);
      set({ selectedService: detail, isLoadingDetail: false });
    } catch {
      set({ isLoadingDetail: false });
    }
  },

  updateService: (updated) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === updated.id ? updated : s)),
      selectedService: state.selectedService?.id === updated.id ? updated : state.selectedService,
    }));
  },

  clear: () =>
    set({
      services: [],
      selectedService: null,
      isLoading: false,
      isLoadingDetail: false,
      initialized: false,
    }),
}));
