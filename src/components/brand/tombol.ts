import { cva, type VariantProps } from "class-variance-authority";

/*
  One recipe for every button-shaped control, applied to `<button>` and `<Link>`
  alike. The primary style had been copied by hand into nine places and had
  already started to drift (py-1.5 here, py-w2 there, gap-1 against gap-1.5).
*/
export const tombol = cva(
  "tekan inline-flex items-center justify-center gap-w2 rounded-sm font-medium whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      nada: {
        /* Dyed cloth: the primary action. */
        utama: "bg-nila-6 text-white shadow-tombol hover:bg-nila-9",
        /* Undyed, outlined: the secondary action on a light ground. */
        garis:
          "border border-garis-kuat bg-white text-tinta hover:border-nila-3 hover:text-nila-tinta",
        /* One dip: the primary action on a dyed ground. 8.1:1 against nila-9 text. */
        terang: "bg-nila-1 font-semibold text-nila-9 hover:bg-white",
        /* Outlined on a dyed ground. nila-1 is 7.2:1 there; nila-3 was 2.8:1. */
        "garis-terang": "border border-nila-1 text-white hover:bg-nila-9",
      },
      ukuran: {
        kecil: "px-w3 py-1.5 text-xs",
        sedang: "px-w4 py-w2 text-sm",
        besar: "px-w4 py-w3 text-sm",
      },
      penuh: {
        true: "w-full",
      },
    },
    defaultVariants: { nada: "utama", ukuran: "sedang" },
  },
);

export type TombolVariants = VariantProps<typeof tombol>;
