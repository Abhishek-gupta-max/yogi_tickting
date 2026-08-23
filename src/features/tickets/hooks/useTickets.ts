import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { ticketsApi } from '../api/tickets.api';
import type { TicketFilters, CreateTicketDto, TicketStatus } from '../types/ticket.types';
import toast from 'react-hot-toast';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  comments: (id: string) => [...ticketKeys.detail(id), 'comments'] as const,
  timeline: (id: string) => [...ticketKeys.detail(id), 'timeline'] as const,
};

export function useTickets(filters: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => ticketsApi.getTickets(filters),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketDto) => ticketsApi.createTicket(data),
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      toast.success(`Ticket ${newTicket.ticketNumber} created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create ticket.');
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketsApi.updateTicketStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.setQueryData(ticketKeys.detail(updated.id), updated);
      toast.success(`Status updated to ${updated.status.replace(/_/g, ' ')}`);
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, agentId, agentName }: { id: string; agentId: string; agentName?: string }) =>
      ticketsApi.assignTicket(id, agentId, agentName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.setQueryData(ticketKeys.detail(updated.id), updated);
      toast.success(`Assigned to ${updated.assignee?.fullName || 'Agent'}`);
    },
  });
}

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.comments(ticketId),
    queryFn: () => ticketsApi.getComments(ticketId),
    enabled: !!ticketId,
  });
}

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, isInternal }: { content: string; isInternal?: boolean }) =>
      ticketsApi.addComment(ticketId, content, isInternal),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.comments(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      toast.success(variables.isInternal ? 'Internal note added' : 'Reply posted');
    },
  });
}

export function useTicketTimeline(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.timeline(ticketId),
    queryFn: () => ticketsApi.getTimeline(ticketId),
    enabled: !!ticketId,
  });
}
