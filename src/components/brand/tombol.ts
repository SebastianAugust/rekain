import { cva, type VariantProps } from "class-variance-authority";

/*
  One recipe for every button-shaped control, applied to `<button>` and `<Link>`
  alike. The primary style had been copied by hand into nine places and had
  already started to drift (py-1.5 here, py-w2 there, gap-1 against gap-1.5).
*/
export const tombol = cva(
  "tekan inline-flex items-center justify-center gap-w2 rounded-full font-semibold whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      nada: {
        /* Dyed cloth: the primary action. */
        utama: "bg-nila-6 text-white shadow-tombol hover:bg-nila-9",
        /* Pale blue-grey pill: the secondary action on a light ground. */
        garis: "bg-awan text-tinta hover:bg-awan-tua",
        /* One dip: the primary action on a dyed ground. 8.1:1 against nila-9 text. */
        terang: "bg-nila-1 font-semibold text-nila-9 hover:bg-white",
        /* Outlined on a dyed ground. nila-1 is 7.2:1 there; nila-3 was 2.8:1. */
        "garis-terang": "border border-nila-1 text-white hover:bg-nila-9",
      },
      ukuran: {
        /* Every size keeps a 44px touch target; only padding and type step. */
        kecil: "min-h-11 px-w4 text-sm",
        sedang: "min-h-11 px-w4 text-sm",
        besar: "min-h-12 px-w5 text-base",
      },
      penuh: {
        true: "w-full",
      },
    },
    defaultVariants: { nada: "utama", ukuran: "sedang" },
  },
);

export type TombolVariants = VariantProps<typeof tombol>;
