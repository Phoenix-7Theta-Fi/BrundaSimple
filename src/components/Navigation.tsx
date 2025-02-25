"use client";

import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="w-full border-b mb-6">
      <Flex gap="4" p="4" justify="center">
        <Button 
          variant={pathname === "/" ? "solid" : "ghost"}
          asChild
        >
          <Link href="/">Upload</Link>
        </Button>
        <Button 
          variant={pathname === "/gallery" ? "solid" : "ghost"}
          asChild
        >
          <Link href="/gallery">Gallery</Link>
        </Button>
      </Flex>
    </nav>
  );
}
