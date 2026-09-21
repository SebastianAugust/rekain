import { z } from "zod";

import { MATERIAL_OPTIONS } from "@/lib/data/seed";

/*
  Schema input types are strings because that is what DOM inputs hand back; Zod
  does the parsing, so the submit handler receives a real number.

  Zod v4: message customisation is `{ error: ... }` — the v3 spellings
  (`message`, `required_error`, `invalid_type_error`) are ignored.
*/
export const uploadLimbahSchema = z.object({
  material: z
    .string()
    .min(1, { error: "Pilih jenis material terlebih dahulu." })
    .pipe(z.enum(MATERIAL_OPTIONS, { error: "Pilih jenis material terlebih dahulu." })),

  berat: z
    .string()
    .trim()
    .min(1, { error: "Berat wajib diisi." })
    .refine((v) => !Number.isNaN(Number(v)), { error: "Berat harus berupa angka." })
    .transform(Number)
    .refine((n) => n > 0, { error: "Berat harus lebih dari 0 kg." })
    .refine((n) => n <= 100_000, { error: "Berat melebihi batas wajar (maks. 100.000 kg)." }),

  lokasi: z.string().trim().min(3, { error: "Lokasi wajib diisi." }),

  catatan: z.string().trim().max(500, { error: "Catatan maksimal 500 karakter." }),
});

/** What the form fields hold (all strings). */
export type UploadLimbahValues = z.input<typeof uploadLimbahSchema>;
/** What the submit handler receives (parsed). */
export type UploadLimbahParsed = z.output<typeof uploadLimbahSchema>;
