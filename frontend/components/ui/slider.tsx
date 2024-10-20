"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {

  function getSatisfactionEmoji(value: number) {
    if (value >= 90) {
      return "😁"; // Very happy (90-100)
    } else if (value >= 70) {
      return "😊"; // Happy (70-89)
    } else if (value >= 50) {
      return "😐"; // Neutral (50-69)
    } else if (value >= 30) {
      return "😕"; // Unhappy (30-49)
    } else {
      return "😢"; // Very unhappy (0-29)
    }
  }
  

  return(
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative b h-4 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400">
      <SliderPrimitive.Range className="absolute h-full bg-transparent dark:bg-neutral-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb children={
      <div className="flex items-center justify-center text-4xl relative bottom-3">
        {getSatisfactionEmoji(props.value[0])}
      </div>
    }  className="block h-4 w-4 rounded-full border border-neutral-200 border-neutral-900/50 bg-blac shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:border-neutral-50/50 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300" />
  </SliderPrimitive.Root>
)})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
