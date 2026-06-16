"use client"

import { GooeyDemo } from "./ui/gooey-demo"

export function Visuals({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {active && <GooeyDemo />}
    </div>
  )
}