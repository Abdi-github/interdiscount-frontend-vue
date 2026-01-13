import { useMutation } from '@tanstack/vue-query';
import { paymentsApi } from '../api/payments.api';

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.initiatePayment(orderId).then((res) => res.data.data),
  });
}

export function useSimulatePayment() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.simulatePayment(orderId).then((res) => res.data.data),
  });
}

export function useInvoicePayment() {
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.invoicePayment(orderId).then((res) => res.data.data),
  });
}
