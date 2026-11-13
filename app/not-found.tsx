import type { Metadata } from "next";
import { Button, Container, EnergyLines, GridBackground } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="relative isolate overflow-hidden bg-ink outline-none">
      <GridBackground />
      <EnergyLines />
      <Container className="relative flex min-h-[80svh] flex-col items-start justify-center py-32">
        <p className="text-eyebrow uppercase text-gold">Error 404</p>
        <h1 className="mt-4 text-h1 font-bold text-white">
          This circuit is <span className="text-glow">open.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lead text-on-dark">
          The page you’re looking for has moved or no longer exists. Let’s get you back to power.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/contact-us" variant="outline" size="lg" arrow>
            Contact Us
          </Button>
        </div>
      </Container>
    </main>
  );
}
