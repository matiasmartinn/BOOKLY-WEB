import { businessService } from 'features/business/business.service';
import type { BusinessModel } from 'shared/models';
import { create } from 'zustand';

interface BusinessStore {
  services: BusinessModel[];
  selectedService: BusinessModel | null;
  isLoading: boolean;
  isLoadingDetail: boolean;

  /**
   * Carga el listado liviano de servicios del owner.
   * Una vez que llega, pre-selecciona el primero automáticamente
   * fetcheando su detalle completo.
   */
  loadServices: (ownerId: number) => Promise<void>;

  /**
   * Cambia el servicio activo.
   * Fetchea el detalle completo vía GET /services/{id} antes de setearlo,
   * para que el dashboard siempre trabaje con datos frescos.
   */
  selectService: (id: number) => Promise<void>;

  /**
   * Actualización local luego de un PUT — evita re-fetchear toda la lista.
   */
  updateService: (updated: BusinessModel) => void;

  clear: () => void;
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  services: [],
  selectedService: null,
  isLoading: false,
  isLoadingDetail: false,

  loadServices: async (ownerId) => {
    set({ isLoading: true });
    try {
      const services = await businessService.getByOwner(ownerId);
      set({ services, isLoading: false });

      // Pre-selecciona el primero si existe
      if (services.length > 0) {
        await get().selectService(services[0].id);
      }
    } catch {
      set({ isLoading: false });
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

  clear: () => set({ services: [], selectedService: null }),
}));
