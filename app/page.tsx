import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/home/cta-band";
import { GeneratorShowcase } from "@/components/home/generator-showcase";
import { Hero } from "@/components/home/hero";
import { Locations } from "@/components/home/locations";
import { Network } from "@/components/home/network";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { TrustBar } from "@/components/home/trust-bar";
import { Values } from "@/components/home/values";

// Title/description from the live homepage (content/home.md).
export const metadata: Metadata = {
  title: { absolute: "Generator Service Providers | PowerChampions" },
  description:
    "PowerChampions is redefining industrial critical power through servant leadership, integrity, and a trusted national network of partners.",
  alternates: { canonical: "/" },
};

/**
 * Each section sits in its own <Suspense> boundary. The content is static, so no
 * fallback ever shows; the boundaries let React hydrate section by section and yield to the browser
 * in between (selective hydration), instead of one long main-thread task. Keeps mobile TBT low.
 */
const sections = [Hero, TrustBar, Values, Network, GeneratorShowcase, Services, Locations, Testimonials, CtaBand];

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {sections.map((Section, i) => (
        <Suspense key={i} fallback={null}>
          <Section />
        </Suspense>
      ))}
    </main>
  );
}
