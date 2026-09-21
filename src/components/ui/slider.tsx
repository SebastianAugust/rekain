"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

/**
 * Registry base-nova tidak mengirim komponen slider, jadi ini ditulis langsung
 * di atas primitif Base UI — sama seperti berkas `ui/` lainnya di sini, hanya
 * menambahkan kelas, tanpa logika sendiri.
 *
 * Trek memakai `garis`, isian memakai `nila-3`: makin jauh ditarik, makin dalam
 * celupannya.
 */
function Slider({ className, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root data-slot="slider" className={cn("w-full", className)} {...props}>
      <SliderPrimitive.Control className="flex h-5 w-full touch-none items-center select-none">
        <SliderPrimitive.Track className="h-1 w-full rounded-full bg-garis">
          <SliderPrimitive.Indicator className="h-full rounded-full bg-nila-3" />
          <SliderPrimitive.Thumb className="size-4 rounded-full border border-nila-9 bg-white shadow-panel outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nila-3 data-[disabled]:opacity-45" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
