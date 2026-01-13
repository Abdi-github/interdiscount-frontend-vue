import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { profileApi } from '../api/profile.api';
import type { UpdateProfilePayload, ChangePasswordPayload, AddressPayload } from '../types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile().then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileApi.updateProfile(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => profileApi.changePassword(data).then((res) => res.data),
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => profileApi.getAddresses().then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressPayload) => profileApi.createAddress(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: AddressPayload & { id: string }) =>
      profileApi.updateAddress(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profileApi.deleteAddress(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
