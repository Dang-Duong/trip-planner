import type { LngLat, Trip } from "@/lib/types";

// Both trail lines are komoot's own tracks, simplified to ~12 m: the walk-in is the first
// half of tour 81044925 (Polsterlucke → hut), the summit line the way up of smart tour
// 1914197, which goes back down the same way. To regenerate:
//   curl https://api.komoot.de/v007/tours/81044925/coordinates
//   curl https://api.komoot.de/v007/smart_tours/1914197/coordinates

const walkIn: LngLat[] = [
  [14.12012, 47.68185], [14.11988, 47.68193], [14.12074, 47.68353], [14.1203, 47.68466],
  [14.11852, 47.68626], [14.11834, 47.68715], [14.11684, 47.68939], [14.11611, 47.69092],
  [14.11417, 47.69183], [14.11493, 47.69246], [14.11554, 47.69243], [14.11568, 47.6928],
  [14.11288, 47.6937], [14.11145, 47.69565], [14.10871, 47.69662], [14.10803, 47.69644],
  [14.10561, 47.69648], [14.10315, 47.69584], [14.10004, 47.69626], [14.09734, 47.69512],
  [14.09717, 47.69526], [14.09657, 47.69509], [14.09643, 47.69522], [14.09516, 47.69508],
  [14.09438, 47.69556], [14.09429, 47.69499], [14.09387, 47.69488], [14.09382, 47.69457],
  [14.09337, 47.69496], [14.09303, 47.6947], [14.09246, 47.69478], [14.09178, 47.69507],
  [14.09231, 47.69567], [14.09187, 47.69625], [14.09178, 47.69596], [14.09076, 47.6959],
  [14.09041, 47.69548], [14.09035, 47.69566], [14.09015, 47.69558], [14.08957, 47.69589],
  [14.08931, 47.69655], [14.08854, 47.69668], [14.08826, 47.69705], [14.08841, 47.69718],
  [14.08798, 47.69732], [14.08787, 47.69759], [14.08962, 47.69771], [14.09067, 47.6982],
  [14.0895, 47.69839], [14.0891, 47.69882], [14.08767, 47.69951], [14.08734, 47.69989],
  [14.08812, 47.70009], [14.08829, 47.70022], [14.08808, 47.70043], [14.08577, 47.70164],
  [14.08505, 47.7025], [14.08332, 47.70374], [14.08276, 47.70452], [14.08202, 47.70484],
];

const summitLine: LngLat[] = [
  [14.08197, 47.70484], [14.0817, 47.70484], [14.0814, 47.70502], [14.08159, 47.70516],
  [14.08024, 47.70582], [14.07791, 47.70635], [14.07691, 47.70675], [14.07382, 47.7063],
  [14.07311, 47.70597], [14.07298, 47.70555], [14.07203, 47.70479], [14.07127, 47.7048],
  [14.07094, 47.70508], [14.07024, 47.70522], [14.06874, 47.70528], [14.06675, 47.70678],
  [14.06674, 47.7078], [14.06511, 47.70856], [14.06478, 47.70953], [14.06492, 47.71057],
  [14.06476, 47.7108], [14.06436, 47.71078], [14.06291, 47.7113], [14.06174, 47.7113],
  [14.05985, 47.71158], [14.05876, 47.71213], [14.05851, 47.71208], [14.05824, 47.71243],
  [14.05792, 47.71219], [14.05746, 47.71243], [14.05715, 47.71169], [14.0565, 47.71244],
  [14.05658, 47.71327], [14.05585, 47.71351], [14.0557, 47.714], [14.05593, 47.7144],
  [14.05705, 47.7152], [14.05727, 47.71586], [14.05778, 47.71611], [14.0585, 47.71632],
  [14.06047, 47.71639], [14.06324, 47.71697],
];

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const dir = (from: string, to: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    from,
  )}&destination=${encodeURIComponent(to)}&travelmode=driving`;

export const grosserPriel2026: Trip = {
  slug: "grosser-priel-2026",
  title: "Großer",
  titleAccent: "↑",
  titleTail: "Priel",
  dates: "24–25 Oct 2026",
  subtitle:
    "24–25 Oct 2026 · Čongus & Tung · Praha out and back · one night at the Prielschutzhaus",
  blurb: "Čongus & Tung · Praha out and back · one night at the Prielschutzhaus",

  stats: [
    { value: "2", label: "people" },
    { value: "650", label: "km driving" },
    { value: "1 900", label: "m ascent" },
    { value: "2 515", label: "m high point" },
    { value: "~9 h", label: "summit day" },
  ],

  people: ["Čongus", "Tung"],

  waypoints: [
    { id: "praha", name: "Praha", at: [14.47, 50.02], kind: "start", note: "start 07:00 Sat", labelSide: "right" },
    { id: "budejovice", name: "České Budějovice", at: [14.47, 48.97], kind: "stop" },
    { id: "linz", name: "Linz", at: [14.29, 48.3], kind: "stop", note: "onto the A9 Pyhrn" },
    // Coordinates from OSM (Nominatim/Overpass).
    { id: "polsterlucke", name: "Polsterlucke", at: [14.12037, 47.68236], kind: "start", note: "620 m · car park", labelSide: "below" },
    { id: "hut", name: "Prielschutzhaus", at: [14.08197, 47.70492], kind: "hut", note: "1 420 m · night Sat" },
    { id: "brotfall", name: "Brotfallscharte", at: [14.05713, 47.71168], kind: "stop", note: "~2 320 m", labelSide: "left" },
    { id: "priel", name: "Großer Priel", at: [14.06325, 47.71694], kind: "goal", note: "2 515 m · turn back by 11:00" },
    { id: "spitzmauer", name: "Spitzmauer", at: [14.06203, 47.69556], kind: "peak", note: "2 446 m", labelSide: "below" },
  ],

  maps: [
    {
      id: "overview",
      title: "Praha → Hinterstoder",
      waypoints: ["praha", "budejovice", "linz", "polsterlucke"],
      // OSRM, as for the Chamonix trip:
      //   curl "https://router.project-osrm.org/route/v1/driving/\
      //   14.47,50.02;14.12037,47.68236?overview=simplified&geometries=geojson"
      routeLine: [
        [14.4696, 50.0203], [14.5701, 50.0031], [14.7152, 49.9038], [14.6329, 49.6546],
        [14.7366, 49.2589], [14.5207, 49.058], [14.5225, 48.9786], [14.4274, 48.8415],
        [14.486, 48.744], [14.4422, 48.654], [14.52, 48.5061], [14.4813, 48.3624],
        [14.2963, 48.3233], [14.2978, 48.2214], [14.1776, 48.1755], [14.0363, 48.0637],
        [14.1136, 47.8759], [14.17, 47.8437], [14.18, 47.7239], [14.1204, 47.6824],
      ],
      note: "Praha → Polsterlucke 324 km · D3 and the S10 to Linz, then the A9 Pyhrn · real road geometry",
    },
    {
      id: "sat",
      title: "Sat · walk-in",
      pitch: 55,
      bearing: -20,
      waypoints: ["polsterlucke", "hut", "spitzmauer"],
      routeLine: walkIn,
      note: "From the Polsterlucke car park up through the forest to the Prielschutzhaus. About 800 m up.",
    },
    {
      id: "sun",
      title: "Sun · Großer Priel",
      pitch: 55,
      bearing: -20,
      waypoints: ["hut", "brotfall", "priel", "polsterlucke"],
      routeLine: [...walkIn, ...summitLine],
      note: "From the hut up the Kühkar to the Brotfallscharte, then the cabled summit ridge. Back down the same way, past the hut to the car at Polsterlucke.",
    },
  ],

  pins: [
    {
      when: "Sat",
      what: "Praha → Hinterstoder · 324 km",
      sub: "About 4 h, plus a stop. Holiday weekend in Austria — allow longer.",
      cost: "—",
      href: dir("Praha", "Parkplatz Polsterlucke Hinterstoder"),
      linkLabel: "Route ↗",
    },
    {
      when: "Sat hike",
      what: <b>Parkplatz Polsterlucke</b>,
      sub: "End of the road above Hinterstoder, where the path starts. Pay and display; the car stays overnight, so buy for both days.",
      cost: "paid",
      href: maps("Parkplatz Polsterlucke Hinterstoder"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Night",
      what: <b>Prielschutzhaus, 1 420 m</b>,
      sub: "Staffed daily until 1 Nov 2026, earlier if winter arrives. Half board. Phone +43 7564 20602.",
      cost: "—",
      href: "https://www.alpsonline.org/reservation/calendar?hut_id=336&header=yes",
      linkLabel: "Book ↗",
    },
    {
      when: "Sun",
      what: "Hinterstoder → Praha · 324 km",
      cost: "—",
      href: dir("Parkplatz Polsterlucke Hinterstoder", "Praha"),
      linkLabel: "Route ↗",
    },
  ],

  pinsNote: (
    <>
      Trail map: <a href="https://www.austrianmap.at/">ÖK austrianmap</a> · conditions:{" "}
      <a href="https://www.prielschutzhaus.com/">the hut</a>, phone{" "}
      <span className="mono">+43 7564 20602</span>.
    </>
  ),

  flagsTitle: "Late October · what's different",
  flags: [
    <>
      <b>Clocks go back early Sunday.</b> Sunday is light from about 06:10 and dark by 17:00, so
      the summit day starts by headtorch and the turn-back is 11:00.
    </>,
    <>
      <b>Snow is the whole risk.</b> In past years the Priel was clean on 24 Oct about half the
      time, had real snow about a quarter, and leftover patches with icy cables the rest. Nights
      are −5 to −10 °C up there, so expect ice on the cables in the morning every year.
    </>,
    <>
      <b>Plan B if there&rsquo;s fresh snow above 2 000 m: Traunstein</b> from Gmunden, an hour
      closer to home. Phone the hut on Thursday and decide then.
    </>,
    <>
      <b>Mon 26 Oct is the Austrian national holiday.</b> Busy hut, busy trail — book the hut now.
    </>,
    <>
      <b>Austrian vignette: the 10-day one, €12.80.</b> One day doesn&rsquo;t cover a Sat–Sun.
      Buy it on shop.asfinag.at; the 10-day one is valid straight away.
    </>,
  ],

  days: [
    {
      date: "24",
      title: "Sat · Praha → Prielschutzhaus",
      meta: "324 km · +800 m on foot",
      mapId: "sat",
      legs: [
        { time: "07:00", text: <>D3 south past České Budějovice. <b>Fuel up in Czechia.</b></> },
        { time: "~09:15", text: <>Into Austria, S10 to Linz, then the A9 Pyhrn south to Hinterstoder.</> },
        { time: "~11:30", text: <><b>Polsterlucke car park</b>, 620 m. Parking for both days, boots on.</> },
        { time: "12:00", text: <>Walking, up the forest path. Steady and well marked.</> },
        {
          time: "~14:30",
          text: (
            <>
              <b>Prielschutzhaus, 1 420 m.</b> Check in, then look up the Kühkar at what
              tomorrow&rsquo;s route is holding.
            </>
          ),
        },
        { time: "18:00", text: <>Dinner. Ask the hut about snow and ice on the cables.</> },
        { time: "21:00", text: <>Sleep. Clocks go back tonight — alarm 05:30 new time.</> },
      ],
      note: (
        <>
          The walk-in is half of komoot&rsquo;s{" "}
          <a href="https://www.komoot.com/tour/81044925" target="_blank" rel="noreferrer">
            Hinterstoder ↔ Prielschutzhaus
          </a>{" "}
          — about 2½ h up. Sunset 18:00.
        </>
      ),
    },
    {
      date: "25",
      title: "Sun · Großer Priel → Praha",
      meta: "+1 100 m · −1 900 m · 2 515 m",
      mapId: "sun",
      legs: [
        { time: "06:00", text: <><b>Breakfast at the hut</b>, bags packed the night before.</> },
        { time: "06:30", text: <>Walking, headtorch for the first few minutes. Up into the Kühkar.</> },
        {
          time: "~09:30",
          text: (
            <>
              <b>Brotfallscharte, ~2 320 m.</b> Where the cables start. Helmets on, poles away. If
              it&rsquo;s iced up, this is the top.
            </>
          ),
        },
        {
          time: "~10:30",
          text: (
            <>
              <b>Großer Priel, 2 515 m.</b> Highest point in the Totes Gebirge — the Dachstein
              glaciers to the south-west.
            </>
          ),
        },
        {
          time: "11:00",
          text: (
            <b>
              <em>Hard turn-back, on the summit or not.</em>
            </b>
          ),
        },
        { time: "~13:45", text: <>Back at the hut. Collect anything left, soup, water.</> },
        { time: "~15:15", text: <>Polsterlucke. 1 900 m of descent; poles. Sunset 16:58.</> },
        { time: "~19:30", text: <>Praha. 4 h driving, ~4½ with a stop.</> },
      ],
      note: (
        <>
          <b>
            <a href="https://www.komoot.com/smarttour/1914197" target="_blank" rel="noreferrer">
              Komoot&rsquo;s 7 h 12
            </a>{" "}
            is hut to summit and back
          </b>
          ; add 1½ h from the hut down to the car and it is about 9 h on foot. The cables below the
          summit are Buet-chains exposure, T4, and shaded and slow to dry in October.
        </>
      ),
    },
  ],

  // Stats are komoot's own. Every link opened and checked on 1 Oct 2026; if you add one,
  // open it first — komoot retires smart tours and returns 410.
  hikes: [
    {
      name: "Großer Priel from the Prielschutzhaus",
      href: "https://www.komoot.com/smarttour/1914197",
      when: "Totes Gebirge · Sun",
      km: "8.2 km",
      ascent: "+1 060 m",
      time: "7 h 12",
      high: "2 515 m",
      grade: "T4",
      note: (
        <>
          <b>The plan.</b> Cabled ridge, no via-ferrata set.{" "}
          <a href="https://www.komoot.com/highlight/283067" target="_blank" rel="noreferrer">
            Summit ↗
          </a>{" "}
          · walk-in:{" "}
          <a href="https://www.komoot.com/tour/81044925" target="_blank" rel="noreferrer">
            Hinterstoder ↔ hut ↗
          </a>
        </>
      ),
    },
    {
      name: "Spitzmauer from the Prielschutzhaus",
      href: "https://www.komoot.com/smarttour/8256527",
      when: "Totes Gebirge · harder Sun",
      km: "9.8 km",
      ascent: "+980 m",
      time: "6 h 40",
      high: "2 446 m",
      grade: "T4+ / VF B",
      note: (
        <>
          <b>The harder option from the same hut.</b> Komoot&rsquo;s loop goes up the Stodertaler
          Klettersteig (VF B, set needed) and down the normal route (T4+/I). North-facing — skip
          it if anything is iced.{" "}
          <a href="https://www.komoot.com/highlight/295606" target="_blank" rel="noreferrer">
            Summit ↗
          </a>
        </>
      ),
    },
    {
      name: "Traunstein · Naturfreundesteig",
      href: "https://www.komoot.com/tour/77597003",
      when: "Gmunden · plan B",
      km: "12.2 km",
      ascent: "+1 260 m",
      time: "6 h 52",
      high: "1 691 m",
      grade: "T4+",
      note: (
        <>
          <b>If there&rsquo;s snow on the Priel.</b> Ladders and cables up, the Mairalmsteig down.
          A day out, 3½ h from Praha.{" "}
          <a href="https://www.komoot.com/highlight/573600" target="_blank" rel="noreferrer">
            Summit ↗
          </a>
        </>
      ),
    },
  ],

  hikesNote: (
    <>
      <b>Picked on 1 Oct</b> from 26 years of reanalysis data at summit height: a hut that is still
      staffed, the Buet&rsquo;s grade, and the shortest drive of the hard options. Whether it goes
      is decided on Thursday 22 Oct, by the forecast and a call to the hut.
    </>
  ),

  pack: [
    {
      title: "Hiking",
      items: [
        { label: "Boots, broken in" },
        { label: <b>Helmet</b>, sub: "Loose limestone below the Brotfallscharte" },
        { label: <b>Microspikes</b>, sub: "Morning ice on the cables, old snow in the Kühkar" },
        { label: "Trekking poles", sub: "1 900 m of descent on Sunday" },
        { label: "Gloves you can grip a cable in", sub: "Cold steel at 2 400 m" },
        { label: "Headtorch + spares", sub: "Sunday starts in the dark" },
        { label: "1½ L water each", sub: "Refill at the hut" },
        { label: "Trail food for Sunday" },
        { label: "First aid, blisters, foil blanket" },
        { label: "Sunglasses, SPF" },
      ],
    },
    {
      title: "Clothes",
      items: [
        { label: "Base layer + fleece" },
        { label: <b>Insulated jacket</b>, sub: "Below freezing on top in the morning" },
        { label: "Waterproof jacket + overtrousers" },
        { label: "Warm hat, buff" },
        { label: "Spare socks + a dry set for the drive home" },
      ],
    },
    {
      title: "Hut",
      items: [
        { label: <b>Sleeping-bag liner</b>, sub: "Compulsory in Alpenverein huts" },
        { label: "Hut slippers or light socks" },
        { label: "Earplugs", sub: "Holiday weekend — full dorms" },
        { label: "Toiletries + small towel" },
        { label: "Cash in EUR", sub: "Don't count on the card reader" },
        { label: "Alpenverein card, if you have one", sub: "Member discount on the night" },
      ],
    },
    {
      title: "Car & docs",
      items: [
        { label: "ID, licence, registration" },
        { label: <b>Austrian 10-day vignette</b>, sub: "shop.asfinag.at" },
        { label: "Czech dálniční známka" },
        { label: "Hi-vis vests, triangle, first aid" },
        { label: "Coins for the parking machine" },
        { label: "Offline maps" },
        {
          label: (
            <>
              <span className="mono">112</span> · <span className="mono">140</span> Bergrettung
            </>
          ),
        },
      ],
    },
  ],

  prep: [
    { what: <b>Book the Prielschutzhaus, Sat 24 Oct, half board</b>, when: "Now" },
    {
      what: (
        <>
          Austrian 10-day vignette <span className="fine">— €12.80, shop.asfinag.at</span>
        </>
      ),
      when: "Before you go",
    },
    {
      what: (
        <>
          <b>First look at the forecast</b>{" "}
          <span className="fine">— the 16-day forecast reaches the weekend</span>
        </>
      ),
      when: "~10 Oct",
    },
    {
      what: (
        <>
          <b>Forecast + snow line</b> <span className="fine">— GeoSphere Austria, webcams</span>
        </>
      ),
      when: "~20 Oct",
    },
    {
      what: (
        <>
          <b>Phone the hut: snow and ice on the cables?</b>{" "}
          <span className="fine">— Priel or Traunstein</span>
        </>
      ),
      when: "Thu 22 Oct",
    },
  ],

  sources: [
    { label: "Prielschutzhaus", href: "https://www.prielschutzhaus.com/" },
    { label: "ASFINAG vignette", href: "https://shop.asfinag.at/en/products/digital-vignette/" },
    { label: "Open-Meteo history", href: "https://open-meteo.com/en/docs/historical-weather-api" },
  ],
  sourcesNote: "hut dates as published for 2026; nothing booked yet.",
};
