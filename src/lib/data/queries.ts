/** Query key factory — one place to invalidate from, and stable across refactors. */
export const listingKeys = {
  all: ["listings"] as const,
  buyer: ["listings", "buyer"] as const,
  mine: ["listings", "mine"] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
};

export const transactionKeys = {
  all: ["transaksi"] as const,
  pabrik: ["transaksi", "pabrik"] as const,
  buyer: ["transaksi", "buyer"] as const,
};

export const favoritKeys = {
  all: ["favorit"] as const,
};

/*
  The plan depends on the truck size, so capacity is part of the key: changing it
  is a different question, not a stale answer to the same one.
*/
export const ruteKeys = {
  all: ["rute"] as const,
  rencana: (kapasitas: number) => ["rute", "rencana", kapasitas] as const,
};

export const pabrikKeys = {
  all: ["pabrik"] as const,
};
