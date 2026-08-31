import sharm from "@/assets/02-domestic-sharm.jpg.asset.json";
import hurghada from "@/assets/03-domestic-hurghada.jpg.asset.json";
import luxor from "@/assets/04-domestic-luxor.jpg.asset.json";
import aswan from "@/assets/05-domestic-aswan.jpg.asset.json";
import dubai from "@/assets/06-international-dubai.jpg.asset.json";
import istanbul from "@/assets/07-international-istanbul.jpg.asset.json";
import paris from "@/assets/08-international-paris.jpg.asset.json";
import london from "@/assets/09-international-london.jpg.asset.json";

export type Destination = { id: string; key: string; image: string };

export const domestic: Destination[] = [
  { id: "sharm", key: "dest.sharm", image: sharm.url },
  { id: "hurghada", key: "dest.hurghada", image: hurghada.url },
  { id: "luxor", key: "dest.luxor", image: luxor.url },
  { id: "aswan", key: "dest.aswan", image: aswan.url },
];

export const international: Destination[] = [
  { id: "dubai", key: "dest.dubai", image: dubai.url },
  { id: "istanbul", key: "dest.istanbul", image: istanbul.url },
  { id: "paris", key: "dest.paris", image: paris.url },
  { id: "london", key: "dest.london", image: london.url },
];

export const navItems = [
  { to: "/domestic", key: "nav.domestic", index: "01" },
  { to: "/international", key: "nav.international", index: "02" },
  { to: "/flights", key: "nav.flights", index: "03" },
  { to: "/why-online", key: "nav.why", index: "04" },
  { to: "/info", key: "nav.info", index: "05" },
  { to: "/contact", key: "nav.contact", index: "06" },
] as const;