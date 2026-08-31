import { Reveal } from "./Reveal";

export function PageHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <Reveal>
      <p className="eyebrow">{eyebrow}</p>
      <div className="gold-rule mt-3" />
      <h1 className="mt-5 text-4xl leading-tight text-foreground sm:text-5xl">{title}</h1>
      {lead ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead}</p> : null}
    </Reveal>
  );
}