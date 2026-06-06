const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "paper",
  "heroVariant": "lineart",
  "showLineArt": true
}/*EDITMODE-END*/;

const PALETTES = {
  paper: {
    '--cream': '#FBFAF7',
    '--cream-deep': '#F2EEE6',
    '--ink': 'oklch(0.22 0.015 50)',
    '--ink-soft': 'oklch(0.42 0.02 50)',
    '--camel': 'oklch(0.62 0.09 55)',
    '--hairline': '#E6E1D7',
  },
  dusk: {
    '--cream': 'oklch(0.93 0.018 60)',
    '--cream-deep': 'oklch(0.88 0.025 50)',
    '--ink': 'oklch(0.24 0.03 40)',
    '--ink-soft': 'oklch(0.42 0.03 40)',
    '--camel': 'oklch(0.56 0.10 45)',
    '--hairline': 'oklch(0.76 0.02 55)',
  },
  sage: {
    '--cream': 'oklch(0.95 0.012 110)',
    '--cream-deep': 'oklch(0.90 0.02 120)',
    '--ink': 'oklch(0.26 0.025 140)',
    '--ink-soft': 'oklch(0.44 0.025 140)',
    '--camel': 'oklch(0.60 0.085 60)',
    '--hairline': 'oklch(0.78 0.018 120)',
  },
};

// ──────────────────────────────────────────────────────────
// LINE-ART COUPLE (mirrors the save-the-date illustration)
// ──────────────────────────────────────────────────────────
function LineArtCouple({ color = 'currentColor', width = 420 }) {
  // Real line-art illustration — replaces the synthetic SVG
  return (
    <img src="photos/lineart.png" alt="Erika and Brendan, line art"
      width={width}
      style={{
        maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto',
        // tint using the current ink color via filter if needed — kept simple
      }} />
  );
}

// ──────────────────────────────────────────────────────────
// NAV
// ──────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const items = [
    ['story', 'The Story'],
    ['day', 'The Day'],
    ['stay', 'Stay'],
    ['faq', 'FAQ'],
    ['rsvp', 'RSVP'],
  ];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '14px 44px' : '24px 44px',
      background: scrolled ? 'rgb(251 250 247 / 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--hairline)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <a href="#top" className="caps" style={{
        fontSize: 14, textDecoration: 'none', color: 'var(--ink)',
        letterSpacing: '0.18em', whiteSpace: 'nowrap',
      }}>
        E <span style={{ fontFamily: 'Dancing Script, cursive', textTransform: 'none', fontSize: 20, fontWeight: 600, letterSpacing: 0 }}>&</span> B
      </a>
      <div className="nav-links" style={{ display: 'flex', gap: 36 }}>
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="mono" style={{
            color: 'var(--ink)', textDecoration: 'none',
            transition: 'color 0.2s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--camel)'}
          onMouseLeave={e => e.target.style.color = 'var(--ink)'}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ──────────────────────────────────────────────────────────
// HERO — echoes the save-the-date
// ──────────────────────────────────────────────────────────
function Hero({ variant }) {
  if (variant === 'photo') {
    // Full-bleed engagement photo version
    return (
      <section id="top" style={{
        position: 'relative', height: '100vh', minHeight: 720,
        display: 'flex', alignItems: 'flex-end',
        padding: '0 44px 80px',
        overflow: 'hidden',
      }}>
        <div className="grain" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(photos/proposal-smile.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, oklch(0.22 0.015 50 / 0) 0%, oklch(0.22 0.015 50 / 0.15) 50%, oklch(0.22 0.015 50 / 0.65) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, color: 'var(--cream)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div className="script" style={{ fontSize: 'clamp(36px, 5vw, 58px)', marginBottom: 4, opacity: 0.95 }}>
            The wedding of
          </div>
          <h1 className="caps" style={{
            fontSize: 'clamp(48px, 9vw, 130px)',
            fontWeight: 400, lineHeight: 0.95,
            letterSpacing: '0.04em',
            marginBottom: 28,
          }}>
            Erika &amp; Brendan
          </h1>
          <hr className="hairline" style={{ width: 80, borderColor: 'rgb(251 250 247 / 0.4)', margin: '0 0 28px' }} />
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <div className="caps" style={{ fontSize: 'clamp(18px, 2vw, 26px)', letterSpacing: '0.06em' }}>
              Saturday, 3rd April 2027
            </div>
            <div className="serif" style={{ fontSize: 20, fontStyle: 'italic', opacity: 0.85 }}>
              Hunter Valley, NSW
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default — "postcard" version echoing the save-the-date
  return (
    <section id="top" style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '120px 44px 80px',
    }}>
      <div style={{ maxWidth: 720, textAlign: 'center', width: '100%' }}>
        <div className="script" style={{
          fontSize: 'clamp(34px, 4.5vw, 54px)',
          color: 'var(--ink)',
          marginBottom: 18,
        }}>
          The wedding of
        </div>

        <h1 className="caps" style={{
          fontSize: 'clamp(44px, 7.5vw, 92px)',
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: '0.04em',
          color: 'var(--ink)',
          marginBottom: 40,
        }}>
          Erika &amp; Brendan
        </h1>

        <div style={{ margin: '0 auto 40px', color: 'var(--ink)', maxWidth: 720 }}>
          <LineArtCouple color="var(--ink)" width={720} />
        </div>

        <div className="caps" style={{
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          letterSpacing: '0.1em',
          marginBottom: 14,
        }}>
          Saturday 3<sup style={{ fontSize: '0.55em', top: '-0.65em', position: 'relative', marginLeft: 2 }}>rd</sup> April 2027
        </div>
        <div className="serif" style={{
          fontSize: 22, fontStyle: 'italic',
          color: 'var(--ink-soft)',
          marginBottom: 8,
        }}>
          Hunter Valley, NSW
        </div>
        <div className="mono" style={{ color: 'var(--ink-soft)', marginTop: 18 }}>
          Ceremony at 4pm
        </div>

        <div style={{ marginTop: 70 }}>
          <div style={{ width: 1, height: 40, background: 'var(--hairline)', margin: '0 auto' }} />
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// STORY — the Japan proposal, told with photos
// ──────────────────────────────────────────────────────────
function Story() {
  return (
    <section id="story" style={{
      padding: '140px 44px',
      background: 'var(--cream)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader eyebrow="the proposal" title="How it happened" />

        {/* Opening line */}
        <div style={{ maxWidth: 720, margin: '60px auto 0', textAlign: 'center' }}>
          <p className="serif" style={{
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            fontStyle: 'italic', lineHeight: 1.5,
            color: 'var(--ink)',
          }}>
            In November of 2025, on a still morning at Lake Kawaguchiko, with
            Mt&nbsp;Fuji out in full view and a small box in his pocket,
            Brendan asked Erika to marry him.
          </p>
        </div>

        {/* Photo sequence — the proposal */}
        <div className="stack-md" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
          marginTop: 100, alignItems: 'center',
        }}>
          <figure style={{ margin: 0 }}>
            <div style={{
              backgroundImage: 'url(photos/proposal-wide.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              aspectRatio: '3/2',
              position: 'relative',
            }} className="grain" />
          </figure>
          <div style={{ padding: '0 20px' }}>
            <div className="script" style={{
              fontSize: 42, color: 'var(--camel)', marginBottom: 20, lineHeight: 1,
            }}>
              Let's catch the sunrise.
            </div>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: 16 }}>
              The trip had been a year in the planning. Neither Erika or Brendan
              said it out loud, but both had quietly marked this as the one, the trip
              where it would finally happen. Japan did not disappoint: clear skies,
              the best week, and Mt&nbsp;Fuji showing itself that very morning.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85 }}>
              The couple got up early to catch the sunrise, heading to a lookout
              near their accommodation to watch the sun come up. Brendan was ready.
              He'd kept the ring hidden for months, despite Erika's very best snooping.
            </p>
          </div>
        </div>

        <div className="stack-md" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
          marginTop: 120, alignItems: 'center',
        }}>
          <div style={{ padding: '0 20px' }}>
            <p className="serif" style={{
              fontSize: 24, fontStyle: 'italic', lineHeight: 1.5,
              color: 'var(--ink)', marginBottom: 20,
            }}>
              And it so nearly was just the two of them.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85 }}>
              In the half-light before dawn, they had the lookout entirely to
              themselves. Then, as the sun came up, a lone local photographer
              arrived to capture the landscape, and Brendan quietly kicked himself
              for missing the perfect moment with the morning glow and no one else
              around.
            </p>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.85, marginTop: 16 }}>
              As it turned out, the photographer was a blessing in disguise. Before
              leaving, Yuji began taking photos of Erika and Brendan before anything
              had unfolded, and Brendan seized the moment, so the whole thing was
              caught on camera, start to finish.
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <div style={{
              backgroundImage: 'url(photos/proposal-tears.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              aspectRatio: '3/2',
              position: 'relative',
            }} className="grain" />
          </figure>
        </div>

        {/* Three-up gallery */}
        <div className="stack-md" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          marginTop: 80,
        }}>
          {[
            'photos/proposal-hug.jpg',
            'photos/proposal-ring.jpg',
            'photos/proposal-foreheads-2.jpg',
          ].map((src) => (
            <figure key={src} style={{ margin: 0 }}>
              <div style={{
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                aspectRatio: '4/5',
                position: 'relative',
              }} className="grain" />
            </figure>
          ))}
        </div>

        <p className="mono" style={{
          color: 'var(--ink-soft)', marginTop: 20, fontSize: 10, textAlign: 'center',
        }}>
          With thanks to Yuji, who captured these beautiful photos.
        </p>

        {/* Close */}
        <div style={{ maxWidth: 680, margin: '100px auto 0', textAlign: 'center' }}>
          <p className="serif" style={{
            fontSize: 22, fontStyle: 'italic', color: 'var(--ink)',
            lineHeight: 1.5, marginBottom: 16,
          }}>
            From a lake in Japan to a hill in the Hunter, we can't wait to
            have you there for the next part.
          </p>
          <div className="script" style={{ fontSize: 38, color: 'var(--camel)', marginTop: 20 }}>
            Erika &amp; Brendan
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// THE DAY — schedule + venue
// ──────────────────────────────────────────────────────────
function Day() {
  return (
    <section id="day" style={{
      padding: '110px 44px',
      background: 'var(--cream-deep)',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Big date strip */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div className="mono" style={{ color: 'var(--camel)', marginBottom: 16 }}>
            Mark the calendar
          </div>
          <div className="serif" style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontStyle: 'italic', lineHeight: 1,
            color: 'var(--ink)', letterSpacing: '-0.01em',
          }}>
            Saturday, 3 April
          </div>
          <div className="caps" style={{
            fontSize: 'clamp(20px, 2.4vw, 30px)',
            letterSpacing: '0.24em', marginTop: 18,
          }}>
            2027
          </div>
        </div>

        <div className="stack-md" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
          alignItems: 'start',
        }}>
          {/* Schedule */}
          <div>
            <div className="mono" style={{ color: 'var(--camel)', marginBottom: 28 }}>
              The order of things
            </div>
            <div>
              {[
                ['3:00', 'Pre-ceremony', 'Arrive, enjoy a drink &amp; some live music, then find your seat'],
                ['3:30', 'Ceremony', 'A strict start, so please be seated in good time'],
                ['4:15', 'Canapé hour', 'Drinks &amp; canapés on the terrace'],
                ['5:30', 'Reception', 'Dinner, speeches &amp; dancing'],
                ['11:00', 'Event finish', ''],
              ].map(([time, title, sub], i, arr) => (
                <div key={time} style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr',
                  gap: 28, padding: '22px 0',
                  borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--hairline)',
                  alignItems: 'baseline',
                }}>
                  <div className="serif" style={{
                    fontSize: 26, fontStyle: 'italic',
                    color: 'var(--camel)', fontWeight: 400,
                  }}>
                    {time}
                  </div>
                  <div>
                    <div className="serif" style={{ fontSize: 22, marginBottom: 2 }}
                      dangerouslySetInnerHTML={{ __html: title }} />
                    {sub && (
                      <div className="mono" style={{ color: 'var(--ink-soft)', fontSize: 10 }}
                        dangerouslySetInnerHTML={{ __html: sub }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Venue card */}
          <div style={{
            background: 'var(--cream)', border: '1px solid var(--hairline)',
          }}>
            <div style={{ padding: 40 }}>
              <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 12 }}>
                The venue
              </div>
              <h3 className="serif" style={{
                fontSize: 34, fontWeight: 300, marginBottom: 16, letterSpacing: '-0.01em',
              }}>
                Adam's Peak Country Estate
              </h3>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: 28 }}>
                A working vineyard and private estate tucked into the rolling hills
                of the Hunter Valley, with sandstone buildings, ancient gums, and
                sweeping views across the Brokenback Range. We're keeping the rest
                a surprise until you arrive.
              </p>

              <hr className="hairline" style={{ margin: '24px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Row k="Where" v="Hunter Valley, NSW" />
                <Row k="Attire" v="Semi-formal. Blazer and shirt for the men; dresses below the knee for the women." />
                <Row k="Weather" v="Early autumn. Warm days, cool evenings, so bring a wrap." />
                <Row k="Getting there" v="On-site parking, or hop on our free bus (stay in Pokolbin or Broke to use it). Details closer to the day." />
                <Row k="Kids" v="Little ones are welcome. Just have a chat with us first." />
              </div>
            </div>

            {/* Subtle location map */}
            <div style={{
              borderTop: '1px solid var(--hairline)',
              position: 'relative',
              filter: 'grayscale(0.4) sepia(0.18) contrast(0.95)',
              opacity: 0.92,
            }}>
              <iframe
                title="Map to Adam's Peak Country Estate"
                src="https://maps.google.com/maps?q=Adams%20Peak%20Country%20Estate%20%26%20The%20Barn&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%" height="220"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 16 }}>
      <div className="mono" style={{ color: 'var(--ink-soft)', fontSize: 9, paddingTop: 4 }}>{k}</div>
      <div style={{ fontSize: 14, lineHeight: 1.55 }}>{v}</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// STAY
// ──────────────────────────────────────────────────────────
function Stay() {
  const options = [
    {
      name: "The Estate at The Charles",
      area: "Broke",
      cap: "Sleeps 19",
      note: "A spacious estate in the heart of Broke, ideal for a big group sharing.",
      link: "https://brokeaway.com.au/listing/the-estate-at-the-charles-at-broke/?arrive=02-04-2027&depart=05-04-2027&guest=4",
    },
    {
      name: "Marignano Homestead",
      area: "Broke",
      cap: "Sleeps 12",
      note: "A charming country homestead, great for a family or larger group.",
      link: "https://brokeaway.com.au/listing/marignano-homestead/?arrive=02-04-2027&depart=05-04-2027&guest=2",
    },
    {
      name: "The Lane Retreat",
      area: "Pokolbin",
      cap: "Sleeps 2",
      note: "An elegant 4-star retreat with a pool, sun terrace and lush gardens, just a short drive from the wineries.",
      link: "https://www.booking.com/hotel/au/the-lane-retreat.en-gb.html?label=gen173nr-10CAEoggI46AdIM1gEaA-IAQGYATO4AQfIAQzYAQPoAQH4AQGIAgGoAgG4AtOZgNEGwAIB0gIkNjI5MWZkMmUtNjUxMS00NDRlLWI3ZGEtNDY3YzgzNDIyNTYy2AIB4AIB&aid=304142&ucfs=1&arphpl=1&checkin=2027-04-02&checkout=2027-04-05",
    },
    {
      name: "Wine Country Villas",
      area: "Pokolbin",
      cap: "Sleeps 2",
      note: "Private villas set on 25 acres in the heart of the Hunter, a peaceful base close to the cellar doors.",
      link: "https://www.booking.com/hotel/au/wine-country-villas.en-gb.html?aid=304142&checkin=2027-04-02&checkout=2027-04-04&group_adults=2&no_rooms=1&group_children=0",
    },
  ];

  return (
    <section id="stay" style={{ padding: '140px 44px', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <SectionHeader eyebrow="make a weekend of it" title="Where to stay" />

        <p className="serif" style={{
          fontSize: 22, fontStyle: 'italic', textAlign: 'center',
          maxWidth: 640, margin: '36px auto 0', color: 'var(--ink-soft)',
          lineHeight: 1.5,
        }}>
          The Hunter is best as a long weekend. To use the free bus service to and from the wedding, we ask that you stay in Pokolbin or Broke. Here are a few places to start your search.
        </p>

        <div className="stack-md" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24,
          marginTop: 80,
        }}>
          {options.map((o) => (
            <div key={o.name} style={{
              background: 'var(--cream)', border: '1px solid var(--hairline)',
              padding: 40, display: 'flex', flexDirection: 'column',
              transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 44px oklch(0.22 0.015 50 / 0.08)';
              e.currentTarget.style.borderColor = 'var(--camel)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--hairline)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                <span className="mono" style={{ color: 'var(--camel)' }}>{o.area}</span>
                <span className="mono" style={{ color: 'var(--ink-soft)' }}>{o.cap}</span>
              </div>
              <h3 className="serif" style={{ fontSize: 30, fontWeight: 300, marginBottom: 18, letterSpacing: '-0.01em' }}
                dangerouslySetInnerHTML={{ __html: o.name }} />
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.75, flex: 1 }}
                dangerouslySetInnerHTML={{ __html: o.note }} />
              <a href={o.link} target="_blank" rel="noopener" style={{
                marginTop: 28, color: 'var(--ink)', textDecoration: 'none',
                borderBottom: '1px solid var(--ink)', paddingBottom: 4,
                alignSelf: 'flex-start', fontSize: 10, letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}>
                View &nbsp;→
              </a>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 56, padding: 44, textAlign: 'center',
          background: 'var(--cream-deep)',
        }}>
          <div className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 12 }}>A tip</div>
          <p className="serif" style={{
            fontSize: 22, fontStyle: 'italic',
            maxWidth: 680, margin: '0 auto 24px', lineHeight: 1.5,
          }}>
            If you're after a cozy cabin or a large family stay, we recommend browsing
            the farm stays on Broke Away.
          </p>
          <a href="https://brokeaway.com.au/search-results/?area=adams-peak-country-estate&arrive=02-04-2027&depart=05-04-2027&guest=2&adult_guest=2&child_guest=0" target="_blank" rel="noopener" style={{
            color: 'var(--ink)', textDecoration: 'none',
            borderBottom: '1px solid var(--ink)', paddingBottom: 4,
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            Explore Broke Away &nbsp;→
          </a>
        </div>

      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    ['What should I wear?', 'Semi-formal attire. For the women, dresses below the knee. It\'s an outdoor, barn-style reception on grass, so consider your heels. For the men, a blazer and shirt.'],
    ['Can I bring a plus one?', 'If your invitation includes a plus one, it will say so explicitly. Otherwise, we\'ve kept the numbers intentionally small, so please don\'t take it personally.'],
    ['Are kids invited?', 'Little ones are welcome. Just have a chat with us first so we can plan properly.'],
    ['How do I get there?', 'Adam\'s Peak is in the Hunter Valley, about 2 hours north of Sydney. We\'ve organised a free bus to and from the wedding. To use it, please make sure you\'re staying in the Pokolbin or Broke area so we can get everyone to and from the event on time. Note there are no taxis or Ubers in Broke, so you\'ll need to either use our free bus or drive. Pickup points and timings will be shared closer to the day.'],
    ['Is there parking?', 'Yes. Free, on-site, and plenty of it.'],
    ['What about dietary needs?', 'The RSVP form has a spot to tell us about allergies, intolerances, and preferences. The kitchen is excellent and very accommodating.'],
    ['Gifts?', 'Your presence is the real gift. There\'ll be a wishing well on the night for anyone who\'d like to contribute.'],
  ];
  return (
    <section id="faq" style={{
      padding: '140px 44px', background: 'var(--cream-deep)',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <SectionHeader eyebrow="good to know" title="Things you might ask" />

        <div style={{ marginTop: 80 }}>
          {items.map(([q, a], i) => (
            <div key={q} style={{
              borderTop: i === 0 ? '1px solid var(--hairline)' : 'none',
              borderBottom: '1px solid var(--hairline)',
            }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '26px 0', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: 24,
                }}>
                <span className="serif" style={{
                  fontSize: 22, fontWeight: 400, color: 'var(--ink)',
                  fontStyle: open === i ? 'italic' : 'normal',
                }}>
                  {q}
                </span>
                <span style={{
                  fontSize: 22, color: 'var(--camel)',
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.25s',
                  fontWeight: 300,
                }}>+</span>
              </button>
              <div style={{
                maxHeight: open === i ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.35s ease, padding 0.35s ease',
                paddingBottom: open === i ? 26 : 0,
              }}>
                <p style={{
                  fontSize: 15, color: 'var(--ink-soft)',
                  lineHeight: 1.8, maxWidth: 620,
                }}>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// RSVP — multi-step
// ──────────────────────────────────────────────────────────
function RSVP() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(null);
  const [guests, setGuests] = useState([]);
  const [bus, setBus] = useState(null);
  const [diet, setDiet] = useState('');
  const [song, setSong] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const addGuest = () => setGuests(g => [...g, '']);
  const updateGuest = (i, val) => setGuests(g => g.map((x, idx) => idx === i ? val : x));
  const removeGuest = (i) => setGuests(g => g.filter((_, idx) => idx !== i));

  const reset = () => {
    setStep(0); setName(''); setAttending(null);
    setGuests([]); setBus(null); setDiet(''); setSong(''); setMessage('');
    setSubmitError('');
  };

  const submitRsvp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('https://formspree.io/f/xpqeqyjj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          attending: attending ? 'Yes' : 'No',
          guests: guests.filter(Boolean).join(', '),
          bus: attending === true ? (bus === true ? 'Yes' : bus === false ? 'No' : '') : 'N/A',
          dietary: diet || '',
          song: song || '',
          message: message || '',
          _subject: `Wedding RSVP — ${name}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.errors?.map((er) => er.message).join(', ');
        throw new Error(msg || 'Something went wrong. Please try again.');
      }
      setStep(2);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" style={{
      background: 'var(--ink)', color: 'var(--cream)',
      padding: '140px 44px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <span className="script" style={{
          fontSize: 'clamp(100px, 15vw, 200px)',
          color: 'oklch(0.62 0.09 55 / 0.14)',
          lineHeight: 1,
        }}>rsvp</span>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="mono" style={{ color: 'oklch(0.62 0.09 55)', marginBottom: 18 }}>
            RSVP
          </div>
          <h2 className="caps" style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 400, letterSpacing: '0.06em',
            marginBottom: 20,
          }}>
            Will you join us?
          </h2>
          <p className="serif" style={{
            fontSize: 18, fontStyle: 'italic', color: 'oklch(0.78 0.02 70)',
          }}>
            Kindly reply by 31 October 2026.
          </p>
        </div>

        {step === 0 && (
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStep(1); }}
            style={{ textAlign: 'center' }}>
            <label className="mono" style={{
              display: 'block', color: 'oklch(0.78 0.02 70)', marginBottom: 18,
            }}>
              First, what's your full name?
            </label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              style={{
                width: '100%', maxWidth: 420, padding: '16px 20px',
                background: 'transparent', color: 'var(--cream)',
                border: 'none', borderBottom: '1px solid oklch(0.78 0.02 70)',
                fontSize: 24, fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic', textAlign: 'center', outline: 'none',
              }}
            />
            <div>
              <button type="submit" disabled={!name.trim()}
                style={{
                  marginTop: 44, padding: '16px 52px',
                  background: 'var(--camel)', color: 'var(--cream)',
                  border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                  opacity: name.trim() ? 1 : 0.4, whiteSpace: 'nowrap',
                }}>
                Continue →
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={submitRsvp}>
            <p className="serif" style={{
              fontSize: 24, fontStyle: 'italic', textAlign: 'center', marginBottom: 44,
            }}>
              Lovely to hear from you, <span style={{ color: 'oklch(0.72 0.10 55)' }}>{name.split(' ')[0]}</span>.
            </p>

            <Field label="Will you be there?">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Toggle active={attending === true} onClick={() => setAttending(true)}>
                  Joyfully accepts
                </Toggle>
                <Toggle active={attending === false} onClick={() => setAttending(false)}>
                  Regretfully declines
                </Toggle>
              </div>
            </Field>

            {attending && (
              <>
                <Field label="Anyone else you're replying for?" hint="Replying for the whole household? Add the full name of each invited guest, so we can take care of name cards and dietaries for everyone. Only those named on your invitation, please.">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {guests.map((g, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10 }}>
                        <input type="text" value={g}
                          onChange={e => updateGuest(i, e.target.value)}
                          placeholder="Full name"
                          style={{ ...darkInput, flex: 1 }} />
                        <button type="button" onClick={() => removeGuest(i)}
                          aria-label="Remove guest"
                          style={{
                            padding: '0 18px', background: 'transparent', color: 'var(--cream)',
                            border: '1px solid oklch(0.55 0.03 50)', cursor: 'pointer',
                            fontSize: 18, lineHeight: 1, fontFamily: 'Cormorant Garamond, serif',
                          }}>
                          ×
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addGuest}
                      style={{
                        alignSelf: 'flex-start', marginTop: 2,
                        padding: '11px 20px', background: 'transparent', color: 'var(--cream)',
                        border: '1px dashed oklch(0.55 0.03 50)', cursor: 'pointer',
                        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
                      }}>
                      + Add a guest
                    </button>
                  </div>
                </Field>

                <Field label="Private bus shuttle?" hint="We're running a complimentary shuttle to and from the wedding for guests staying in Pokolbin or Broke. Would your party like seats?">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Toggle active={bus === true} onClick={() => setBus(true)}>Yes please</Toggle>
                    <Toggle active={bus === false} onClick={() => setBus(false)}>We'll make our own way</Toggle>
                  </div>
                </Field>

                <Field label="Dietary needs or allergies?" hint="Note the guest's name if it's for someone in your party.">
                  <input type="text" value={diet} onChange={e => setDiet(e.target.value)}
                    placeholder="Vegetarian, nut allergy, etc."
                    style={darkInput} />
                </Field>

                <Field label="A song that will get you on the dance floor?">
                  <input type="text" value={song} onChange={e => setSong(e.target.value)}
                    placeholder="Artist, song title"
                    style={darkInput} />
                </Field>
              </>
            )}

            <Field label="A note for Erika &amp; Brendan">
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                rows={3} placeholder="We'll read every single one."
                style={{ ...darkInput, resize: 'vertical' }} />
            </Field>

            <div style={{ display: 'flex', gap: 14, marginTop: 40, flexDirection: 'column' }}>
              {submitError && (
                <p style={{ fontSize: 13, color: 'oklch(0.75 0.18 25)', textAlign: 'center', letterSpacing: '0.04em' }}>
                  {submitError}
                </p>
              )}
              <div style={{ display: 'flex', gap: 14 }}>
                <button type="button" onClick={() => setStep(0)}
                  style={{
                    padding: '16px 24px',
                    background: 'transparent', color: 'var(--cream)',
                    border: '1px solid oklch(0.78 0.02 70)', cursor: 'pointer',
                    fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                  ← Back
                </button>
                <button type="submit" disabled={attending === null || submitting}
                  style={{
                    flex: 1, padding: '16px 24px',
                    background: 'var(--camel)', color: 'var(--cream)',
                    border: 'none', cursor: (attending !== null && !submitting) ? 'pointer' : 'not-allowed',
                    fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                    opacity: (attending !== null && !submitting) ? 1 : 0.4, whiteSpace: 'nowrap',
                  }}>
                  {submitting ? 'Sending…' : 'Send reply'}
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div className="script" style={{
              fontSize: 'clamp(72px, 12vw, 140px)',
              color: 'oklch(0.72 0.10 55)',
              lineHeight: 1, marginBottom: 24,
            }}>
              {attending ? 'thank you' : "we'll miss you"}
            </div>
            <p className="serif" style={{
              fontSize: 24, fontStyle: 'italic', marginBottom: 18,
              color: 'oklch(0.88 0.015 80)',
            }}>
              {attending
                ? `We can't wait to celebrate with you, ${name.split(' ')[0]}.`
                : `Thanks for letting us know, ${name.split(' ')[0]}. You'll be missed.`}
            </p>
            <p style={{ fontSize: 14, color: 'oklch(0.78 0.02 70)', marginBottom: 44, maxWidth: 420, margin: '0 auto 44px', lineHeight: 1.7 }}>
              If anything changes, you can reply again anytime.
            </p>
            <button onClick={reset} style={{
              padding: '14px 32px',
              background: 'transparent', color: 'var(--cream)',
              border: '1px solid oklch(0.78 0.02 70)', cursor: 'pointer',
              fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
            }}>
              Edit reply
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}

const darkInput = {
  width: '100%', padding: '14px 18px',
  background: 'transparent', color: 'var(--cream)',
  border: '1px solid oklch(0.55 0.03 50)',
  fontSize: 15, fontFamily: 'Inter, sans-serif', outline: 'none',
};

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <label className="mono" style={{
        display: 'block', color: 'oklch(0.78 0.02 70)', marginBottom: hint ? 6 : 14,
      }} dangerouslySetInnerHTML={{ __html: label }} />
      {hint && (
        <div className="serif" style={{
          fontSize: 14, fontStyle: 'italic', color: 'oklch(0.66 0.02 70)', marginBottom: 14,
        }} dangerouslySetInnerHTML={{ __html: hint }} />
      )}
      {children}
    </div>
  );
}

function Toggle({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '15px 18px',
      background: active ? 'var(--camel)' : 'transparent',
      color: 'var(--cream)',
      border: `1px solid ${active ? 'var(--camel)' : 'oklch(0.55 0.03 50)'}`,
      cursor: 'pointer',
      fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
      transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// SECTION HEADER
// ──────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="script" style={{
        color: 'var(--camel)', marginBottom: 12, fontSize: 28,
      }}>
        {eyebrow}
      </div>
      <h2 className="caps" style={{
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 400, letterSpacing: '0.06em',
      }}>
        {title}
      </h2>
      <div style={{
        width: 36, height: 1, background: 'var(--camel)',
        margin: '26px auto 0',
      }} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// FOOTER
// ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: '90px 44px 44px', textAlign: 'center',
      background: 'var(--cream)',
    }}>
      <div style={{ color: 'var(--ink)', opacity: 0.85, marginBottom: 24 }}>
        <LineArtCouple color="var(--ink)" width={340} />
      </div>
      <div className="script" style={{
        fontSize: 58, color: 'var(--camel)', lineHeight: 1, marginBottom: 14,
      }}>
        Erika &amp; Brendan
      </div>
      <div className="caps" style={{
        color: 'var(--ink-soft)', fontSize: 12, letterSpacing: '0.22em',
      }}>
        3 April 2027
      </div>
      <hr className="hairline" style={{ margin: '40px auto', width: 60 }} />
      <div className="mono" style={{ fontSize: 9, color: 'var(--ink-soft)' }}>
        Hunter Valley, NSW &nbsp;·&nbsp; See you soon
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────
// APP
// ──────────────────────────────────────────────────────────
function App() {
  const [tweaks] = useState(TWEAK_DEFAULTS);

  useEffect(() => {
    const p = PALETTES[tweaks.palette] || PALETTES.paper;
    const root = document.documentElement;
    Object.entries(p).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [tweaks.palette]);

  return (
    <>
      <Nav />
      <Hero variant={tweaks.heroVariant} />
      <Story />
      <Day />
      <Stay />
      <FAQ />
      <RSVP />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
