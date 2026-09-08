"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  favoritKeys,
  listingKeys,
  pabrikKeys,
  ruteKeys,
  transactionKeys,
} from "@/lib/data/queries";
import * as store from "@/lib/data/store";
import type { NewListingInput, NewOfferInput } from "@/lib/types";

/*
  The only data surface the UI is allowed to touch. Components never import the
  store directly, so replacing these bodies with Supabase queries later requires
  no changes in any component.
*/

export function useListings() {
  return useQuery({ queryKey: listingKeys.buyer, queryFn: store.fetchListingsForBuyer });
}

export function useListing(id: string) {
  return useQuery({ queryKey: listingKeys.detail(id), queryFn: () => store.fetchListing(id) });
}

export function useMyListings() {
  return useQuery({ queryKey: listingKeys.mine, queryFn: store.fetchMyListings });
}

export function useTransaksiPabrik() {
  return useQuery({ queryKey: transactionKeys.pabrik, queryFn: store.fetchTransaksiPabrik });
}

export function useTransaksiBuyer() {
  return useQuery({ queryKey: transactionKeys.buyer, queryFn: store.fetchTransaksiBuyer });
}

export function useFavorit() {
  return useQuery({ queryKey: favoritKeys.all, queryFn: store.fetchFavorit });
}

export function useToggleFavorit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => store.toggleFavorit(id),
    onSuccess: (ids) => {
      queryClient.setQueryData(favoritKeys.all, ids);
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewListingInput) => store.createListing(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewOfferInput) => store.createOffer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

/*
  Logistics. `placeholderData` keeps the previous plan on screen while a new
  truck size is being solved, so changing capacity revises the numbers in place
  instead of collapsing the page back to skeletons.
*/

export function useRencanaRute(kapasitas: number) {
  return useQuery({
    queryKey: ruteKeys.rencana(kapasitas),
    queryFn: () => store.fetchRencanaRute(kapasitas),
    placeholderData: keepPreviousData,
  });
}

export function usePabrik() {
  return useQuery({ queryKey: pabrikKeys.all, queryFn: store.fetchPabrik });
}
