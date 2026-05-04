"use client"

import { Collapsible as CollapsiblePrimitive } from "radix-ui"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={[
        "overflow-hidden",
        "data-[state=open]:[animation:collapsible-down_200ms_ease-out]",
        "data-[state=closed]:[animation:collapsible-up_150ms_ease-in]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}


export { Collapsible, CollapsibleTrigger, CollapsibleContent }
