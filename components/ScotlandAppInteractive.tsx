
'use client';
import React, { useMemo, useState } from "react";

export default function ScotlandAppInteractive() {
  const FALLBACK_BG =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop";
  const BG_LADYS_TOWER =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Lady%27s_Tower%2C_Elie_-_geograph.org.uk_-_6365064.jpg/1280px-Lady%27s_Tower%2C_Elie_-_geograph.org.uk_-_6365064.jpg";
  const BG_BIRKHILL = "https://upload.wikimedia.org/wikipedia/commons/0/0f/Birkhill_Castle.jpg";

  const dataUrlToBlobUrl = (dataUrl: string) => {
    try {
      if (!dataUrl.startsWith("data:")) return dataUrl;
      const [meta, b64] = dataUrl.split(",");
      const mime = meta.slice(5, meta.indexOf(";"));
      const bin = atob(b64);
      const len = bin.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime || "image/webp" });
      return URL.createObjectURL(blob);
    } catch { return dataUrl; }
  };

  const ladyURL = useMemo(() => dataUrlToBlobUrl(BG_LADYS_TOWER), []);
  const birkURL = useMemo(() => dataUrlToBlobUrl(BG_BIRKHILL), []);

  type Guest = { name: string; photoUrl?: string; socials?: string; city?: string; cell?: string; dietary?: string; flightArrive?: string; flightDepart?: string; activities: string[]; };
  type Activity = { id: string; title: string; dateTime: string; cost: string; description: string; cap?: number; };

  const [tab, setTab] = useState<"home" | "schedule" | "guests" | "castle" | "activities">("home");
  const [guestTab, setGuestTab] = useState<"profile" | "roster">("profile");
  const [guest, setGuest] = useState<Guest>({ name: "", activities: [] });

  const activities: Activity[] = [
    { id: "A_CLAY", title: "Clay Pigeons at Birkhill", dateTime: "Jan 5 · 1:00 – 3:00 PM", cost: "Included", description: "Group lunch followed by clay pigeon shooting on the grounds.", cap: 20 },
    { id: "A_WHSKY", title: "Whisky Distillery Tour", dateTime: "Jan 6 · 2:00 – 4:00 PM", cost: "Included", description: "Guided whisky tour and tasting as part of birthday celebrations.", cap: 25 },
    { id: "A_TRHUNT", title: "Treasure Hunt at Birkhill", dateTime: "Jan 8 · 2:00 – 4:00 PM", cost: "Included", description: "Afternoon treasure hunt across castle grounds, prizes and fun included.", cap: 30 },
  ];

  const [itinerary] = useState<{ id: string; title: string; time: string }[]>([
    { id: "E_ARRIVE", title: "Arrivals · Property Tours & Welcome Drinks", time: "Jan 4 · after 4:00 PM" },
    { id: "E_DIN4", title: "Dinner & Entertainment · Birkhill", time: "Jan 4 · 7:00 PM" },
    { id: "E_CLAY", title: "Lunch & Clay Pigeons · Birkhill", time: "Jan 5 · 12:00 – 3:00 PM" },
    { id: "E_DIN5", title: "Dinner & Entertainment · Birkhill", time: "Jan 5 · 7:30 PM" },
    { id: "E_WHSKY", title: "Whisky Tour & Tasting", time: "Jan 6 · 2:00 – 4:00 PM" },
    { id: "E_DIN6", title: "Birthday Dinner (Kilts & Black Tie) · Dining Room", time: "Jan 6 · 8:00 PM" },
    { id: "E_DAYTRIP", title: "Day Trip · St. Andrews / Edinburgh", time: "Jan 7 · Afternoon" },
    { id: "E_DIN7", title: "Evening · Nightcaps at Birkhill", time: "Jan 7 · 9:00 PM" },
    { id: "E_TRHUNT", title: "Treasure Hunt · Birkhill Grounds", time: "Jan 8 · 2:00 – 4:00 PM" },
    { id: "E_DIN8", title: "Dinner & Nightcaps · Birkhill", time: "Jan 8 · 7:30 PM" },
    { id: "E_DEPART", title: "Departures · Breakfast & Checkout", time: "Jan 9 · by 10:00 AM" },
  ]);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white tracking-tight" style={{ textShadow: "0 2px 6px rgba(0,0,0,.45)" }}>{children}</h2>
  );

  const Background: React.FC<{ src?: string }> = ({ src }) => (
    <>
      <img src={(src || FALLBACK_BG)} alt="" aria-hidden="true" className="fixed inset-0 z-0 w-full h-full object-cover object-center select-none pointer-events-none" />
      <div className="fixed inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(6,16,12,0.20)_0%,rgba(6,16,12,0.40)_25%,rgba(6,16,12,0.65)_55%,rgba(6,16,12,0.94)_100%)]" />
    </>
  );

  const NavButton = ({ id, label }: { id: typeof tab; label: string }) => (
    <button onClick={() => setTab(id)} className={`text-sm md:text-base font-medium pb-1 ${tab === id ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`} style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>{label}</button>
  );

  type RosterPerson = { name: string; photo?: string; socials?: string; city?: string; flightArrive?: string; flightDepart?: string; activitiesCount?: number };
  const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0,2).map(s => s[0]?.toUpperCase() || "").join("");

  const ProfileCard = ({ person }: { person: RosterPerson }) => {
    const Pin = () => (<svg viewBox="0 0 24 24" className="inline-block w-3.5 h-3.5 mr-1 align-[-2px] opacity-90" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>);
    return (
      <div className="group p-4 bg-black/30 hover:bg-black/40 transition-colors backdrop-blur-[1.5px]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-black/40 overflow-hidden flex items-center justify-center">
            {person.photo ? (<img src={person.photo} alt={person.name} className="w-full h-full object-cover" />) : (<span className="font-semibold tracking-wide" style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>{initials(person.name)}</span>)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate" style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>{person.name}</p>
            {person.socials && <p className="text-xs text-white/90 truncate">{person.socials}</p>}
            {person.city && (<p className="text-xs text-white/90 truncate"><Pin />{person.city}</p>)}
          </div>
        </div>
      </div>
    );
  };

  const sampleRoster: RosterPerson[] = [
    { name: "Matt Suber", photo: "", socials: "", city: "", flightArrive: "", flightDepart: "", activitiesCount: 0 },
    { name: "Coco Example", socials: "@coco", city: "New York, NY", activitiesCount: 2 },
    { name: "Jamie King", city: "London", activitiesCount: 1 },
    { name: "Avery Lee", socials: "@averylee", city: "San Francisco, CA", activitiesCount: 3 },
    { name: "Sanjay Patel", city: "Toronto", activitiesCount: 0 },
    { name: "Nora Zhao", socials: "linkedin.com/in/nzhao", city: "Seattle, WA", activitiesCount: 1 },
  ];

  return (
    <div className="min-h-screen text-white/95 pb-24 tracking-tight relative antialiased">
      <Background src={tab === "castle" ? birkURL : ladyURL} />
      <header className="relative z-20 px-6 pt-6 pb-4 border-b border-[#c2a35c]/70 bg-[#08110d]/40 backdrop-blur-[2px] flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-white" style={{ textShadow: "0 3px 10px rgba(0,0,0,.5)" }}>Over the Hill in the Highlands</h1>
          <p className="text-xs md:text-sm text-white/90" style={{ textShadow: "0 1px 2px rgba(0,0,0,.45)" }}>Birkhill Castle | 4-9 Jan 2026</p>
        </div>
      </header>

      {tab === "home" && (
        <main className="relative z-20 p-6 space-y-8 leading-relaxed">
          <div className="p-4 md:p-5">
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,.45)" }}>Welcome</h3>
            <p className="text-[15px] md:text-base max-w-prose" style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>
              Welcome to our virtual castle. We’ll use this space as the information hub for our time together in Scotland.
              Through the app, you'll find our schedule, guest and castle details, and along with an invitation to share
              details surrounding your trip, introduce yourself, and sign up for shenanigans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 md:p-5">
              <SectionTitle>Today’s Highlight</SectionTitle>
              <p className="font-medium text-lg" style={{ textShadow: "0 1px 2px rgba(0,0,0,.4)" }}>{itinerary[0].title}</p>
              <p className="text-sm text-white/90" style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>{itinerary[0].time}</p>
            </div>
            <div className="p-4 md:p-5">
              <SectionTitle>Quick Links</SectionTitle>
              <div className="grid grid-cols-2 gap-2 text-base">
                <button onClick={() => setTab("schedule")} className="underline underline-offset-4 decoration-[#c2a35c]/70 hover:text-[#c2a35c] text-left">Schedule</button>
                <button onClick={() => setTab("activities")} className="underline underline-offset-4 decoration-[#c2a35c]/70 hover:text-[#c2a35c] text-left">Shenanigans</button>
                <button onClick={() => setTab("guests")} className="underline underline-offset-4 decoration-[#c2a35c]/70 hover:text-[#c2a35c] text-left">Guests</button>
                <button onClick={() => setTab("castle")} className="underline underline-offset-4 decoration-[#c2a35c]/70 hover:text-[#c2a35c] text-left">Castle Info</button>
              </div>
            </div>
          </div>
        </main>
      )}

      {tab === "schedule" && (
        <main className="relative z-20 p-6 space-y-6 leading-relaxed">
          <SectionTitle>Schedule</SectionTitle>
          <div className="text-white/90">Schedule grid goes here (see full prototype for details).</div>
        </main>
      )}

      {tab === "activities" && (
        <main className="relative z-20 p-6 space-y-6 leading-relaxed">
          <SectionTitle>Shenanigans</SectionTitle>
          <div className="text-white/90">Activities list goes here (see full prototype).</div>
        </main>
      )}

      {tab === "guests" && (
        <main className="relative z-20 p-6 space-y-6 leading-relaxed">
          <SectionTitle>Guests</SectionTitle>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setGuestTab("profile")} className={`px-3 py-2 text-sm ${guestTab === "profile" ? "bg-[#c2a35c] text-black" : "bg-black/30"}`}>My Profile</button>
            <button onClick={() => setGuestTab("roster")} className={`px-3 py-2 text-sm ${guestTab === "roster" ? "bg-[#c2a35c] text-black" : "bg-black/30"}`}>Meet the Others</button>
          </div>
          {guestTab === "profile" && (
            <div className="p-4 md:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Name (required)</span>
                  <input value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Your full name" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Profile Image URL (optional)</span>
                  <input value={guest.photoUrl || ""} onChange={(e) => setGuest({ ...guest, photoUrl: e.target.value })} placeholder="https://…" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Links to Socials (optional)</span>
                  <input value={guest.socials || ""} onChange={(e) => setGuest({ ...guest, socials: e.target.value })} placeholder="IG @handle, LinkedIn URL, etc." className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">City (optional)</span>
                  <input value={guest.city || ""} onChange={(e) => setGuest({ ...guest, city: e.target.value })} placeholder="City, Country (e.g., Washington, DC)" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Allergy & Dietary Preferences (private)</span>
                  <textarea value={guest.dietary || ""} onChange={(e) => setGuest({ ...guest, dietary: e.target.value })} placeholder="e.g., dairy-free, nut allergy, vegetarian" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white min-h-[84px] focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Flight Arrival (optional)</span>
                  <input value={guest.flightArrive || ""} onChange={(e) => setGuest({ ...guest, flightArrive: e.target.value })} placeholder="Airline + flight # + ETA + Airport" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm text-white/90">Flight Departure (optional)</span>
                  <input value={guest.flightDepart || ""} onChange={(e) => setGuest({ ...guest, flightDepart: e.target.value })} placeholder="Airline + flight # + ETD + Airport" className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[#c2a35c]" />
                </label>
              </div>
            </div>
          )}
          {guestTab === "roster" && (
            <div className="p-4 md:p-5">
              <p className="text-sm text-white/90 mb-3">Here’s who’s coming (tap a card):</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleRoster.map((p, i) => (<ProfileCard key={i} person={p} />))}
              </div>
            </div>
          )}
        </main>
      )}

      {tab === "castle" && (
        <main className="relative z-20 p-6 space-y-6 leading-relaxed">
          <SectionTitle>Castle Map & Details</SectionTitle>
          <div className="p-4 md:p-5">
            <h3 className="font-serif text-xl" style={{ textShadow: "0 2px 6px rgba(0,0,0,.45)" }}>At a Glance</h3>
            <ul className="text-[15px] text-white list-disc pl-5 space-y-1" style={{ textShadow: "0 1px 2px rgba(0,0,0,.35)" }}>
              <li>15 bedrooms with a mix of ensuite/shared baths</li>
              <li>Great Hall, Library, Dining Room, and expansive gardens</li>
              <li>30–40 minute drive from St Andrews / Dundee area</li>
            </ul>
            <a className="inline-block mt-3 text-[#c2a35c] underline text-sm" href="https://www.birkhillcastle.com" target="_blank" rel="noreferrer">Visit Website</a>
          </div>
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#08110d]/65 backdrop-blur-[2px] border-t border-[#c2a35c]/70 flex justify-around py-3">
        <button onClick={() => setTab("home")} className={`text-sm md:text-base font-medium pb-1 ${tab === "home" ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`}>Home</button>
        <button onClick={() => setTab("schedule")} className={`text-sm md:text-base font-medium pb-1 ${tab === "schedule" ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`}>Schedule</button>
        <button onClick={() => setTab("activities")} className={`text-sm md:text-base font-medium pb-1 ${tab === "activities" ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`}>Shenanigans</button>
        <button onClick={() => setTab("guests")} className={`text-sm md:text-base font-medium pb-1 ${tab === "guests" ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`}>Guests</button>
        <button onClick={() => setTab("castle")} className={`text-sm md:text-base font-medium pb-1 ${tab === "castle" ? "text-[#c2a35c] border-b-2 border-[#c2a35c]" : "text-white/95 border-b-2 border-transparent"}`}>Castle</button>
      </nav>
    </div>
  );
}
