import type { StaticImageData } from "next/image";
import ashish from "@/public/images/site/ashish-achlerkar.jpg";
import erik from "@/public/images/site/erik-headshot-light-background.png";
import kevin from "@/public/images/site/kevin-mullinix.jpg";
import kyle from "@/public/images/site/kyle-headshot.jpg";
import todd from "@/public/images/site/todd-dinchak.jpg";
import dewey from "@/public/images/site/dewey.jpg";
import chris from "@/public/images/site/chris.jpg";
import tom from "@/public/images/site/tom-wein-1.png";
import timRiedel from "@/public/images/site/tim-riedel.jpg";
import shana from "@/public/images/site/shana-headshot-light-background.png";
import doug from "@/public/images/site/doug-wilson-updated-headshot-2026.png";
import ruth from "@/public/images/site/ruth-king-updated-headshot-jan-2026.png";
import david from "@/public/images/site/david-hagewood-headshot-light-background.png";

/** People from content/who-we-are.md. Bios are read from the content file by name. */
export type Person = { name: string; title?: string; photo: StaticImageData; crop?: string };

export const LEADERSHIP: Person[] = [
  // Half-body shot: zoom so the face matches the other headshots.
  { name: "Ashish Achlerkar", title: "Founder & Chief Barrier Remover", photo: ashish, crop: "scale-[1.45] origin-[50%_8%]" },
  { name: "Erik Duthie", title: "Head of Operations", photo: erik },
  { name: "Kevin Mullinix", title: "Head of People-Empowerment", photo: kevin },
  { name: "Kyle Michael", title: "Head of Sales", photo: kyle },
  { name: "Todd Dinchak", title: "Platform Controller", photo: todd },
  { name: "Dewey Brunson", title: "Platform Services Manager", photo: dewey },
  { name: "Christopher Metz", title: "Regional Operations Manager – Platform Services Expert", photo: chris },
  { name: "Tom Wein", title: "Head of Learning and Development", photo: tom },
];

export const ADVISORY: Person[] = [
  { name: "Tim Riedel", photo: timRiedel },
  { name: "Shana Duthie", photo: shana },
  { name: "Doug Wilson", photo: doug },
  { name: "Ruth King", photo: ruth },
  { name: "David Hagewood", photo: david },
];
