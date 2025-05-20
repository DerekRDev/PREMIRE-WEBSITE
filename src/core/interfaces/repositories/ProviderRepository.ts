import { Provider } from '../../entities/Provider';

export interface ProviderRepository {
  findById(id: string): Promise<Provider | null>;
  findAll(): Promise<Provider[]>;
  findBySpecialty(specialty: string): Promise<Provider[]>;
  findByLocation(locationId: string): Promise<Provider[]>;
  findAvailable(
    startDate: string,
    endDate: string,
    specialty?: string,
    locationId?: string
  ): Promise<Provider[]>;
  create(provider: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider>;
  update(id: string, provider: Partial<Provider>): Promise<Provider>;
  updateAvailability(id: string, availability: Provider['availability']): Promise<Provider>;
  delete(id: string): Promise<boolean>;
}