import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { FeatureGrid, ProcessSteps, ServiceHero, SplitChecklist } from "@/components/services/blocks";
import { Button } from "@/components/ui";
import technicianImg from "@/public/images/site/ndustrial-and-commercial-generator-services1.webp";
import maintenanceImg from "@/public/images/site/technician-generator-oil-check.jpg";
import rentalImg from "@/public/images/site/data-center-solutions--2.webp";

export const metadata: Metadata = {
  title: "Backup Power Centers",
  description:
    "Comprehensive critical power services across the Southeast — generator maintenance, turnkey installation, rentals, compliance, and 24/7 emergency response.",
  alternates: { canonical: "/backup-power-centers" },
};

/* Copy: content/backup-power-centers.md (live page), verbatim. */

export default function BackupPowerCentersPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ServiceHero
        scene="core"
        crumbs={[
          { label: "Generator Services", href: "/backup-power-centers" },
          { label: "Backup Power Centers", href: "/backup-power-centers" },
        ]}
        eyebrow="Generator services"
        title={
          <>
            Backup Power <span className="text-glow">Centers</span>
          </>
        }
        intro="Critical Power Services in the Southeastern United States."
        actions={
          <>
            <Button href="/contact-us" size="lg">
              Get A Quote Today
            </Button>
            <Button href="/locations" variant="outline" size="lg" arrow>
              Find a Location
            </Button>
          </>
        }
        specs={[
          { value: "24/7/365", label: "Emergency service response" },
          { value: "NFPA 110", label: "Aligned maintenance programs" },
          { value: "10kW–4,500kW", label: "Engineered backup power systems" },
          { value: "All brands", label: "Brand-agnostic generator expertise" },
        ]}
      />

      <FeatureGrid
        id="why-title"
        eyebrow="Why PowerChampions"
        title="Why Industrial Facilities in the Southeast Choose PowerChampions"
        items={[
          { icon: "pin", title: "Southeastern regional coverage with local service teams" },
          { icon: "handshake", title: "Direct access to leading OEM manufacturers" },
          { icon: "engine", title: "Brand-agnostic industrial generator expertise" },
          { icon: "shield", title: "Structured maintenance programs focused on uptime" },
          { icon: "siren", title: "24/7 emergency generator service" },
          { icon: "radar", title: "Remote monitoring and proactive diagnostics" },
          { icon: "crown", title: "Executive-level oversight and disciplined execution" },
          { icon: "bolt", title: "Long-term critical power partner" },
        ]}
        note={
          <p>
            We do not simply service equipment. We operate as a long-term critical power partner — helping industrial and commercial facilities across the
            Southeast extend asset life, maintain compliance, and protect operational continuity.
          </p>
        }
      />

      <SplitChecklist
        id="solutions-title"
        tone="ink-2"
        eyebrow="Backup power solutions"
        title="Industrial & Commercial Backup Power Solutions That Protect Uptime"
        intro={
          <p>
            PowerChampions delivers comprehensive critical power services across the Southeastern U.S., supporting industrial facilities, healthcare systems,
            commercial campuses, municipalities, and mission-critical operations that cannot afford downtime.
          </p>
        }
        listLabel="We specialize in:"
        items={[
          "Industrial generator service and repair",
          "Commercial generator maintenance programs",
          "Healthcare backup power compliance",
          "Emergency generator response",
          "Turnkey generator installation",
          "Portable generator rentals",
        ]}
        note={
          <p>
            From new system engineering to structured preventative maintenance and rapid emergency response, we help facilities across the Southeast reduce
            operational risk and protect long-term system performance. <strong>When reliability matters, execution matters.</strong>
          </p>
        }
        image={technicianImg}
        imageAlt="A technician in a hard hat and high-visibility vest servicing industrial generator equipment"
        caption="Industrial & commercial generator services"
      />

      <SplitChecklist
        id="maintenance-title"
        reverse
        eyebrow="Proactive service"
        title="Industrial & Commercial Generator Maintenance — Proactive Service That Protects Uptime"
        intro={
          <p>
            Reliable standby power requires disciplined maintenance aligned with NFPA 110 standards and manufacturer specifications. We service all major
            generator brands and provide brand-agnostic commercial generator support throughout the Southeast.
          </p>
        }
        listLabel="Our industrial generator maintenance programs in the Southeast include:"
        items={[
          "Routine inspections and full system diagnostics",
          "Load bank testing and operational exercising",
          "Fuel system inspection and polishing coordination",
          "Battery testing and fluid analysis",
          "Compliance documentation and detailed reporting",
          "Remote generator monitoring",
          "24/7/365 emergency service response",
        ]}
        note={
          <p>
            <strong>Our objective is simple:</strong> prevent failures before they occur and ensure your generator performs when needed most.
          </p>
        }
        image={maintenanceImg}
        imageAlt="A PowerChampions technician checks a generator battery and reviews a service checklist"
        caption="NFPA 110-aligned maintenance"
      />

      <SplitChecklist
        id="rentals-title"
        tone="ink-2"
        eyebrow="Fast response across the Southeast"
        title="Emergency & Temporary Generator Rentals"
        intro={
          <>
            <p>
              When facilities require temporary power, speed and coordination are critical. We provide portable generator rentals across the Southeastern United
              States for:
            </p>
          </>
        }
        items={["Emergency power outages", "Planned maintenance shutdowns", "Construction projects", "Peak load demand support"]}
        note={
          <p>
            Our team manages delivery, setup, fueling logistics, and on-site technical support to ensure seamless operations.{" "}
            <strong>Urgency is built into our response model.</strong>
          </p>
        }
        image={rentalImg}
        imageAlt="A portable towable generator ready for temporary power deployment"
        caption="Portable generator rentals"
      />

      <ProcessSteps
        id="install-title"
        tone="ink"
        eyebrow="Generator sales & turnkey installation"
        title="Engineered Backup Power from 10kW to 4,500kW"
        intro={
          <p>
            PowerChampions provides complete industrial and commercial generator installation services across the Southeastern U.S. Our turnkey capabilities
            include:
          </p>
        }
        spec={{ value: "10kW–4,500kW", label: "Engineered backup power" }}
        steps={[
          { icon: "gauge", title: "Load analysis and system sizing" },
          { icon: "handshake", title: "Direct OEM generator procurement" },
          { icon: "switch", title: "Switchgear and automatic transfer switch integration" },
          { icon: "plug", title: "Electrical and infrastructure coordination" },
          { icon: "bolt", title: "Startup testing and commissioning" },
          { icon: "layers", title: "Project management from design through final delivery" },
        ]}
        note={
          <p>We engineer backup power systems designed for long-term operational reliability in demanding industrial and commercial environments.</p>
        }
      />

      <CtaBand
        eyebrow="Get a quote"
        title="Keep Your Business Powered. No Matter What."
        text="From generator installation and preventive maintenance to emergency repairs and temporary power solutions, PowerChampions delivers reliable critical power services to keep your operations running without interruption."
        primary={{ label: "Get a Quote Today", href: "/contact-us" }}
        secondary={{ label: "Data Center Solutions", href: "/data-center-solutions" }}
      />
    </main>
  );
}
