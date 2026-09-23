import { useReveal } from "./useReveal";

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" ref={ref} className="py-20 px-4 sm:px-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Image */}
        <div className="reveal-mask relative aspect-[3/4] overflow-hidden bg-[#141210]">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&h=1300&fit=crop&auto=format"
            alt="Red Door Studio atelier"
            className="w-full h-full object-cover"
          />
          {/* Gold accent frame */}
          <div
            className="absolute"
            style={{
              top: 20,
              left: 20,
              right: -20,
              bottom: -20,
              border: "1px solid rgba(201,164,106,0.25)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Text */}
        <div>
          <p className="reveal text-[10px] tracking-[0.5em] uppercase text-[#c9a46a] mb-6" style={{ fontFamily: "var(--font-sans)" }}>
            The Studio
          </p>
          <h2
            className="reveal text-[clamp(2rem,3.5vw,3.2rem)] font-light text-[#f0e8d5] leading-[1.1] mb-8"
            style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
          >
            Architecture is{" "}
            <em style={{ fontStyle: "italic", color: "#c9a46a" }}>the art</em>
            <br />
            of ordering space for life
          </h2>

          <div className="space-y-5">
            {[
              {
                text: "Red Door Studio was founded in Cairo with a single conviction: that every Egyptian family deserves a home designed with the same rigour and sensitivity as the great houses of the Mediterranean. We do not separate architecture from interior design — they are one discipline.",
                delay: "0.15s",
              },
              {
                text: "Our process begins with listening. We map the way you move through your days — morning light at breakfast, evening gathering in the kitchen, the quality of silence in a bedroom — and translate those rhythms into floor plans, volumes, and materials.",
                delay: "0.22s",
              },
              {
                text: "The palette we return to — black Marquina marble, custom walnut millwork, brushed brass, olive cabinetry — is not a signature style imposed on clients. It is a vocabulary we reach for because these materials age honestly, photograph beautifully, and endure.",
                delay: "0.29s",
              },
            ].map(({ text, delay }, i) => (
              <p
                key={i}
                className="about-copy reveal text-[14px] text-[#c4b89a]/70 leading-relaxed"
                style={{ animationDelay: delay, fontFamily: "var(--font-sans)", fontWeight: 300 }}
              >
                {text}
              </p>
            ))}
          </div>

          {/* Stats */}
          <div className="reveal mt-12 grid grid-cols-3 gap-0 border-t border-[#282318] pt-8" style={{ animationDelay: "0.35s" }}>
            {[
              { n: "60+", label: "Projects Completed" },
              { n: "8", label: "Years in Practice" },
              { n: "100%", label: "Custom Design" },
            ].map(({ n, label }) => (
              <div key={label} className="pr-4">
                <p
                  className="text-[2rem] font-light text-[#c9a46a] leading-none mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {n}
                </p>
                <p
                  className="about-stat-label text-[10px] tracking-[0.15em] uppercase text-[#7a6e5e]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
