import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cpu,
  Home,
  Info,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Neural",
    href: "/neural",
    icon: BrainCircuit,
  },
  {
    title: "Hardware",
    href: "/hardware",
    icon: Cpu,
  },
  {
    title: "Order",
    href: "/order",
    icon: ShoppingCart,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: MessageCircle,
  },
];


