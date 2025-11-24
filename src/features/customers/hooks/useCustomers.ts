import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import type { CreateCustomerInput, UpdateCustomerInput } from '../schemas/customer.schema';

const QUERY_KEYS = {
  customers: ['customers'] as const,
  customer: (id: string) => ['customers', id] as const,
  stats: ['customers', 'stats'] as const,
  search: (query: string) => ['customers', 'search', query] as const,
};

/**
 * Hook to fetch all customers for the authenticated consultant
 */
export const useCustomers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.customers,
    queryFn: () => customerService.getAll(),
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useCustomer = (customerId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.customer(customerId),
    queryFn: () => customerService.getById(customerId),
    enabled: !!customerId,
  });
};

/**
 * Hook to search customers
 */
export const useSearchCustomers = (query: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.search(query),
    queryFn: () => customerService.search(query),
    enabled: !!query,
  });
};

/**
 * Hook to get customer statistics
 */
export const useCustomerStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => customerService.getStats(),
  });
};

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
};

/**
 * Hook to update an existing customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: UpdateCustomerInput }) =>
      customerService.update(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
};

/**
 * Hook to delete a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => customerService.delete(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    },
  });
};

/**
 * Hook to update customer checklist item
 */
export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      key,
      value,
    }: {
      customerId: string;
      key: string;
      value: boolean;
    }) => customerService.updateChecklistItem(customerId, key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customers });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer(variables.customerId) });
    },
  });
};
