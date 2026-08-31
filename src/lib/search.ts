import { domestic, international } from "./destinations";
import { dict, type Lang } from "./i18n";

export type SearchEntry = {
  id: string;
  to: string;
  titleKey: string;
  descKey?: string;
  categoryKey: string;
  image?: string;
  extra?: { en: string; ar: string };
};

export const searchEntries: SearchEntry[] = [
  { id: "home", to: "/", titleKey: "nav.home", descKey: "hero.subtitle", categoryKey: "search.cat.pages" },
  {
    id: "p-domestic",
    to: "/domestic",
    titleKey: "nav.domestic",
    descKey: "home.domesticDesc",
    categoryKey: "search.cat.services",
    extra: { en: "egypt trips stays hotels red sea nile", ar: "مصر رحلات إقامة فنادق البحر الأحمر النيل" },
  },
  {
    id: "p-international",
    to: "/international",
    titleKey: "nav.international",
    descKey: "home.internationalDesc",
    categoryKey: "search.cat.services",
    extra: { en: "visa schengen tourism business abroad", ar: "تأشيرة شنغن سياحة بيزنس الخارج" },
  },
  {
    id: "p-flights",
    to: "/flights",
    titleKey: "nav.flights",
    descKey: "home.flightsDesc",
    categoryKey: "search.cat.flights",
    extra: { en: "flight ticket airline booking airport fare", ar: "طيران تذكرة حجز مطار سعر" },
  },
  { id: "p-why", to: "/why-online", titleKey: "nav.why", descKey: "home.whyDesc", categoryKey: "search.cat.pages" },
  { id: "p-info", to: "/info", titleKey: "nav.info", descKey: "home.infoDesc", categoryKey: "search.cat.pages" },
  {
    id: "p-contact",
    to: "/contact",
    titleKey: "nav.contact",
    descKey: "home.contactDesc",
    categoryKey: "search.cat.pages",
    extra: { en: "phone whatsapp support help", ar: "هاتف واتساب دعم مساعدة" },
  },
  { id: "p-account", to: "/account", titleKey: "acc.title", descKey: "acc.lead", categoryKey: "search.cat.pages" },
  {
    id: "p-bookings",
    to: "/account/bookings",
    titleKey: "acc.bookings",
    descKey: "acc.bookingsLead",
    categoryKey: "search.cat.pages",
  },
  ...domestic.map((d) => ({
    id: `d-${d.id}`,
    to: "/domestic",
    titleKey: d.key,
    descKey: `${d.key}.d`,
    categoryKey: "search.cat.destinations",
    image: d.image,
  })),
  ...international.map((d) => ({
    id: `i-${d.id}`,
    to: "/international",
    titleKey: d.key,
    descKey: `${d.key}.d`,
    categoryKey: "search.cat.destinations",
    image: d.image,
  })),
  {
    id: "offer-visa-review",
    to: "/why-online",
    titleKey: "search.offer.review",
    descKey: "search.offer.reviewD",
    categoryKey: "search.cat.offers",
  },
  {
    id: "offer-fast",
    to: "/contact",
    titleKey: "search.offer.fast",
    descKey: "search.offer.fastD",
    categoryKey: "search.cat.offers",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

function textFor(key: string | undefined, lang: Lang) {
  if (!key) return "";
  return dict[key]?.[lang] ?? "";
}

export function searchSite(query: string, lang: Lang) {
  const q = normalize(query);
  if (!q) return [];
  return searchEntries
    .map((entry) => {
      const title = textFor(entry.titleKey, lang);
      const desc = textFor(entry.descKey, lang);
      const other: Lang = lang === "en" ? "ar" : "en";
      const haystack = normalize(
        [title, desc, textFor(entry.titleKey, other), entry.extra?.[lang] ?? "", entry.extra?.[other] ?? ""].join(" "),
      );
      const titleN = normalize(title);
      let score = 0;
      if (titleN.startsWith(q)) score = 100;
      else if (titleN.includes(q)) score = 70;
      else if (haystack.includes(q)) score = 40;
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.entry);
}