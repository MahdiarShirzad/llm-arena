import {
  BookOpenTextIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  ScaleIcon,
  SettingsIcon,
  SwordsIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Arena", icon: SwordsIcon },
  { href: "/judge", label: "Judge", icon: ScaleIcon },
  { href: "/brochure", label: "Brochure", icon: BookOpenTextIcon },
  { href: "/templates", label: "Templates", icon: LayoutTemplateIcon },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function navItemForPath(pathname: string): NavItem {
  return (
    navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    ) ?? navItems[0]
  );
}
