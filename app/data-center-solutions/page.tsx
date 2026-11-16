import type { Metadata } from "next";
import { CtaBand } from "@/components/home/cta-band";
import { CaseStudy, FeatureGrid, NameChips, ServiceHero, SplitChecklist, Statements } from "@/components/services/blocks";
import { Button, RevealOnScroll } from "@/components/ui";
import engineeringImg from "@/public/images/site/ats-testing-1.png";
import racksImg from "@/public/images/site/data-center.webp";
import engineImg from "@/public/images/site/service-data-center-team.jpg";
import installImg from "@/public/images/site/ats-image.webp";

export const metadata: Metadata = {
  title: "Data Center Power Solutions",
  description:
    "PowerChampions provides reliable power solutions, uptime support, procurement, and lifecycle service for critical infrastructure across the Southeast.",
  alternates: { canonical: "/data-center-solutions" },
};

/* Copy: content/data-center-solutions.md (live page), verbatim. */

export default function DataCenterSolutionsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <ServiceHero
        scene="racks"
        crumbs={[
          { label: "Generator Services", href: "/data-center-solutions" },
          { label: "Data Center Solutions", href: "/data-center-solutions" },
        ]}
        eyebrow="Generator services"
        title={
          <>
            Data Center <span className="text-glow">Solutions</span>
          </>
        }
        intro={
          <>
            <p className="font-bold text-fg">Powering Critical Infrastructure with Discipline, Speed, and Accountability.</p>
            <p className="mt-3 text-base">
              At PowerChampions, we protect the systems that protect everything else. We deliver engineered power generation solutions, strategic equipment
              procurement, precision installation, and long-term lifecycle service for mission-critical environments across the Southeast.
            </p>
          </>
        }
        actions={
          <>
            <Button href="/contact-us" size="lg">
              Partner With Us
            </Button>
            <Button href="/backup-power-centers" variant="outline" size="lg" arrow>
              Backup Power Centers
            </Button>
          </>
        }
        specs={[
          { value: "4.2MW", label: "Generator solutions with full paralleling" },
          { value: "4000A", label: "Paralleling & switchgear configurations" },
          { value: "130 ATS", label: "Units delivered within a 12-week window" },
          { value: "Direct OEM", label: "Factory-level engineering access" },
        ]}
      />

      <Statements
        id="approach-title"
        eyebrow="Our approach"
        title="Eliminate uncertainty. Protect uptime. Build long-term reliability."
        body={
          <p>
            From healthcare and manufacturing to commercial campuses and data centers, our responsibility is clear. Whether supporting complex new construction,
            accelerating procurement timelines, integrating parallel systems, or managing multi-site service programs, we operate as a long-term partner, not a
            transactional vendor.
          </p>
        }
        lines={["We engage early.", "We execute with discipline.", "We stay long after commissioning."]}
      />

      <SplitChecklist
        id="engineering-title"
        tone="ink-2"
        eyebrow="Engineering & planning"
        title="Engineering & Planning Support"
        intro={
          <p>
            We help you address the power challenge before it arises. Reliability starts at the planning stage, and we collaborate with developers, EPCs,
            consulting engineers, and procurement teams to bring clarity and confidence to the execution of complex projects.
          </p>
        }
        listLabel="Our engineering support includes:"
        items={[
          "Generator sizing and load strategy",
          "Paralleling and switchgear configurations up to 4000A",
          "Budgetary pricing for feasibility and capital planning",
          "Direct OEM engineering coordination",
          "Lead time strategy and risk mitigation",
          "Redundancy architecture consultation",
        ]}
        note={
          <p>
            We deliver generator solutions up to 4.2MW with full paralleling capability and direct manufacturer access.{" "}
            <strong>Our objective is simple: reduce risk before construction begins.</strong>
          </p>
        }
        image={engineeringImg}
        imageAlt="A technician in high-visibility gear testing automatic transfer switch equipment"
        caption="ATS testing & engineering"
      />

      <FeatureGrid
        id="procurement-title"
        eyebrow="Strategic equipment procurement"
        title="Direct OEM Relationships. Faster Execution. Clear Visibility."
        intro={
          <p>
            In today’s market, procurement strategy determines project success. Through direct strategic partnerships with leading manufacturers, including Generac
            and other mission-critical OEMs we provide:
          </p>
        }
        items={[
          { icon: "cog", title: "Factory-level engineering access" },
          { icon: "chart", title: "Production visibility and allocation planning" },
          { icon: "clock", title: "Reduced and predictable lead times" },
          { icon: "crown", title: "Executive-level coordination when urgency demands it" },
        ]}
        note={
          <p>
            While many competitors quote multi-year timelines for large-scale units, we consistently deliver faster, with select sizes available sooner and limited
            inventory positioned strategically. In critical infrastructure, speed protects capital. <strong className="text-fg">We deliver speed with accountability.</strong>
          </p>
        }
      />

      <SplitChecklist
        id="install-title"
        tone="ink-2"
        reverse
        eyebrow="Precision integration in complex environments"
        title="Installation & Commissioning"
        intro={<p>Execution is where planning proves itself. Our team supports:</p>}
        items={[
          "Paralleling gear and switchgear installation",
          "Turnkey generator integration",
          "ATS deployment at scale",
          "Commissioning coordination",
          "Multi-site rollouts across the Southeast",
        ]}
        aside={
          <CaseStudy
            label="Project spotlight"
            title="Galaxy Helios project · Afton, Texas"
            stats={[
              { value: "130", label: "ATS units manufactured & delivered" },
              { value: "12", label: "Week delivery window" },
              { value: "<3", label: "Weeks to first wave onsite" },
            ]}
          >
            <p>
              We understand the pace and coordination required in mission-critical construction. For example, our team members worked on the Galaxy Helios project
              in Afton, Texas. We manufactured and delivered 130 ATS units within a 12-week window, with the first wave arriving onsite in under three weeks.
            </p>
          </CaseStudy>
        }
        image={installImg}
        imageAlt="An automatic transfer switch control panel with meters and indicator lights"
        caption="Switchgear & ATS integration"
      />

      <SplitChecklist
        id="lifecycle-title"
        eyebrow="Reliability does not end at startup"
        title="Lifecycle Service & Compliance"
        intro={
          <p>
            Commissioning is not the finish line; it is the beginning of long-term accountability. PowerChampions provides:
          </p>
        }
        items={[
          "Fully brand-agnostic generator service",
          "Preventative maintenance aligned with NFPA standards",
          "24/7 emergency response",
          "Multi-site service programs",
          "Long-term asset lifecycle planning",
          "Redundancy architecture consultation",
        ]}
        note={
          <p>
            We operate with discipline, documentation, and transparent communication, ensuring facilities teams have visibility, confidence, and control over their
            backup power strategy. <strong>We are not simply servicing equipment. We are protecting operational continuity.</strong>
          </p>
        }
        image={engineImg}
        imageAlt="A diesel generator engine with fuel filter and battery disconnect, ready for lifecycle service"
        caption="Brand-agnostic lifecycle service"
      />

      <SplitChecklist
        id="vertical-title"
        tone="ink-2"
        reverse
        eyebrow="Focus vertical"
        title="Mission-Critical Data Centers"
        intro={
          <p>
            Data centers demand absolute reliability, accelerated timelines, and zero tolerance for execution gaps. PowerChampions serves as the strategic power
            partner for mission-critical data center environments across the Southeast, from early engineering through lifecycle service.
          </p>
        }
        listLabel="We support:"
        items={[
          "Large-scale generator solutions up to 4.2MW",
          "Full paralleling integration",
          "Accelerated procurement strategies",
          "Scaled ATS deployment",
          "Multi-campus service programs",
        ]}
        aside={
          <RevealOnScroll className="mt-10 space-y-8">
            <NameChips label="Our team experience includes facilities such as:" names={["One Wilshire", "Garland Center Data Center", "Equinix"]} />
            <NameChips label="We also partner directly with leading mission-critical builders including:" names={["Rosendin Electric", "Ramtek Mission Critical Solutions", "ClayCo"]} />
          </RevealOnScroll>
        }
        note={<p><strong>When uptime is non-negotiable, partnership is everything.</strong></p>}
        image={racksImg}
        imageAlt="Rows of server racks inside a data center hall"
        caption="Mission-critical data centers"
      />

      <FeatureGrid
        id="leaders-title"
        eyebrow="Why PowerChampions"
        title="Why Critical Infrastructure Leaders Choose PowerChampions"
        items={[
          { icon: "handshake", title: "Direct OEM partnerships with engineering access" },
          { icon: "engine", title: "Brand-agnostic service capabilities" },
          { icon: "clock", title: "Faster, more predictable lead times" },
          { icon: "server", title: "Multi-site operational support" },
          { icon: "crown", title: "Executive-level involvement" },
          { icon: "target", title: "Long-term partnership mindset" },
          { icon: "users", title: "Deep industry experience across engineering, construction, and service" },
          { icon: "shield", title: "We operate without short-term pressure. Our model is built for stability, accountability, and sustained performance." },
        ]}
      />

      <CtaBand
        eyebrow="Mission-critical power"
        title="Let’s Strengthen Your Power Strategy"
        text="Whether you are planning new infrastructure, expanding capacity, or evaluating long-term generator lifecycle management, PowerChampions engages early and executes reliably. Connect with our leadership team to discuss how we can support your mission-critical power strategy."
        primary={{ label: "Partner With Us", href: "/contact-us" }}
        secondary={{ label: "Find a Location", href: "/locations" }}
      />
    </main>
  );
}
