import { z } from "zod";

import { formatBerat } from "@/lib/format";

/**
 * The upper bound is the listing's remaining stock, so the schema is built per
 * listing rather than declared once.
 */
export function buildPenawaranSchema(stokTersedia: number) {
  return z.object({
    jumlah: z
      .string()
      .trim()
      .min(1, { error: "Jumlah wajib diisi." })
      .refine((v) => !Number.isNaN(Number(v)), { error: "Jumlah harus berupa angka." })
      .transform(Number)
      .refine((n) => n > 0, { error: "Jumlah harus lebih dari 0 kg." })
      .refine((n) => n <= stokTersedia, {
        error: `Jumlah melebihi stok tersedia (${formatBerat(stokTersedia)}).`,
      }),

    catatan: z.string().trim().max(500, { error: "Catatan maksimal 500 karakter." }),
  });
}

export type PenawaranSchema = ReturnType<typeof buildPenawaranSchema>;
export type PenawaranValues = z.input<PenawaranSchema>;
export type PenawaranParsed = z.output<PenawaranSchema>;
