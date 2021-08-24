import { NavItemType } from "components/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

const otherPageChildMenus: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/sculpture",
    name: "Sculpture",
  },
  {
    id: ncNanoId(),
    href: "/comic",
    name: "Comic",
  },
  {
    id: ncNanoId(),
    href: "/graphic",
    name: "Graphic",
  },
  {
    id: ncNanoId(),
    href: "/installation",
    name: "Installation Art",
  },
  {
    id: ncNanoId(),
    href: "/body",
    name: "Body Art",
  },
  {
    id: ncNanoId(),
    href: "/painting",
    name: "Painting",
  },
  {
    id: ncNanoId(),
    href: "/media",
    name: "Media Art",
  },
  {
    id: ncNanoId(),
    href: "/object",
    name: "Object Art",
  },
  {
    id: ncNanoId(),
    href: "/performance",
    name: "Performance",
  },
  {
    id: ncNanoId(),
    href: "/drawing",
    name: "Drawing",
  },
];

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Home",
  },
  {
    id: ncNanoId(),
    href: "#",
    name: "Categories",
    type: "dropdown",
    children: otherPageChildMenus,
  },
  {
    id: ncNanoId(),
    href: "#",
    name: "Artists",
  },

  {
    id: ncNanoId(),
    href: "#",
    name: "Contact",
  },
];
