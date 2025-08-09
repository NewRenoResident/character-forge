import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import NextLink from "next/link";

import React, {
  ComponentProps,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from "react";

interface ILink {
  href?: string;
  children: ReactNode;
  target?: HTMLAttributeAnchorTarget;
  className?: string;
}

const linkVariants = cva("text-accents-1", {
  variants: {
    underline: {
      none: "no-underline hover:no-underline",
      hover: null,
      always: "underline hover:underline",
    },
  },
});

export const Link = ({
  href,
  children,
  target,
  disabled,
  underline,
  className,
}: ILink &
  ComponentProps<typeof Button> &
  VariantProps<typeof linkVariants>) => {
  return (
    <Button
      className={cn(linkVariants({ underline, className }))}
      variant="link"
      asChild={!disabled}
      disabled={disabled}
    >
      <NextLink target={target ?? "_blank"} href={href ?? "#"}>
        {children}
      </NextLink>
    </Button>
  );
};
