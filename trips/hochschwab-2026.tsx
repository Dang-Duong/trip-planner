import type { LngLat, Trip } from "@/lib/types";

// The way up is komoot tour 111843032 (Schiestlhaus → Seewiesen) reversed, simplified to
// ~12 m; the summit line is BRouter's hiking-mountain route from the hut. To regenerate:
//   curl https://api.komoot.de/v007/tours/111843032/coordinates
//   curl "https://brouter.de/brouter?lonlats=15.148345,47.622165|15.142451,47.618242&profile=hiking-mountain&format=geojson"

const wayUp: LngLat[] = [
  [15.27266, 47.61856], [15.26559, 47.6192], [15.26216, 47.62024], [15.26056, 47.62025],
  [15.25718, 47.62104], [15.25542, 47.62101], [15.25043, 47.62025], [15.24846, 47.61945],
  [15.2475, 47.61957], [15.24689, 47.61916], [15.2462, 47.61898], [15.24369, 47.61891],
  [15.24133, 47.61961], [15.23976, 47.61901], [15.23505, 47.61878], [15.23377, 47.61829],
  [15.23108, 47.61765], [15.23031, 47.61726], [15.22873, 47.61715], [15.22639, 47.61656],
  [15.22426, 47.61677], [15.22134, 47.61627], [15.22024, 47.61583], [15.21761, 47.61528],
  [15.21593, 47.61424], [15.21423, 47.61408], [15.21403, 47.61417], [15.21428, 47.61446],
  [15.21351, 47.61462], [15.21244, 47.6145], [15.21211, 47.61462], [15.21226, 47.61471],
  [15.21095, 47.61495], [15.21043, 47.61532], [15.20915, 47.61538], [15.20782, 47.6157],
  [15.20643, 47.61617], [15.20555, 47.61625], [15.20359, 47.61712], [15.20083, 47.6174],
  [15.19949, 47.61796], [15.19488, 47.61812], [15.19366, 47.61784], [15.1929, 47.61811],
  [15.18951, 47.61701], [15.18796, 47.61616], [15.18664, 47.61509], [15.18479, 47.61442],
  [15.18401, 47.61446], [15.18384, 47.61431], [15.18355, 47.61445], [15.1829, 47.61395],
  [15.18291, 47.61369], [15.18212, 47.61356], [15.18198, 47.61378], [15.18012, 47.61255],
  [15.17995, 47.61219], [15.18054, 47.61218], [15.17668, 47.61192], [15.17496, 47.61228],
  [15.17275, 47.61218], [15.17107, 47.61242], [15.16949, 47.6122], [15.16826, 47.61247],
  [15.16647, 47.61256], [15.16173, 47.61388], [15.16038, 47.6148], [15.15957, 47.6159],
  [15.16027, 47.61569], [15.16026, 47.61644], [15.15994, 47.61675], [15.16007, 47.61717],
  [15.16084, 47.61711], [15.16152, 47.61678], [15.16165, 47.61711], [15.16234, 47.617],
  [15.16237, 47.61753], [15.16334, 47.61867], [15.16301, 47.61924], [15.1632, 47.61937],
  [15.16301, 47.61989], [15.16129, 47.62048], [15.16094, 47.62035], [15.15957, 47.62118],
  [15.1578, 47.62176], [15.15686, 47.62253], [15.15635, 47.62264], [15.15547, 47.62246],
  [15.15434, 47.62137], [15.15375, 47.62169], [15.15311, 47.62179], [15.15102, 47.62119],
  [15.1505, 47.62122], [15.14919, 47.62207],
];

const summitLine: LngLat[] = [
  [15.14851, 47.62218], [15.14881, 47.62199], [15.1486, 47.62175], [15.14849, 47.62117],
  [15.14784, 47.62022], [15.14713, 47.61957], [15.14671, 47.61931], [15.14611, 47.61928],
  [15.14591, 47.61913], [15.14495, 47.61928], [15.14439, 47.61914], [15.14341, 47.61864],
  [15.14266, 47.61804],
];

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const dir = (from: string, to: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    from,
  )}&destination=${encodeURIComponent(to)}&travelmode=driving`;

export const hochschwab2026: Trip = {
  slug: "hochschwab-2026",
  title: "Seewiesen",
  titleAccent: "↑",
  titleTail: "Hochschwab",
  dates: "24–25 Oct 2026",
  subtitle:
    "24–25 Oct 2026 · Čongus & Tung · Praha out and back · one night at the Schiestlhaus",
  blurb: "Čongus & Tung · Praha out and back · one night at the Schiestlhaus",

  stats: [
    { value: "2", label: "people" },
    { value: "770", label: "km driving" },
    { value: "1 400", label: "m ascent" },
    { value: "2 277", label: "m high point" },
    { value: "~4½ h", label: "walk up Sat" },
  ],

  people: ["Čongus", "Tung"],

  waypoints: [
    { id: "praha", name: "Praha", at: [14.47, 50.02], kind: "start", note: "start 04:30 Sat", labelSide: "right" },
    { id: "budejovice", name: "České Budějovice", at: [14.47, 48.97], kind: "stop" },
    { id: "amstetten", name: "Amstetten", at: [14.87, 48.12], kind: "stop", note: "off the A1" },
    { id: "mariazell", name: "Mariazell", at: [15.32, 47.77], kind: "stop" },
    // Coordinates from OSM (Nominatim) and the end of the komoot track.
    { id: "seewiesen", name: "Seewiesen", at: [15.27266, 47.61856], kind: "start", note: "~940 m · car park", labelSide: "right" },
    { id: "florl", name: "Florlhütte", at: [15.21012, 47.61523], kind: "stop", note: "1 284 m", labelSide: "below" },
    { id: "voisthaler", name: "Voisthalerhütte", at: [15.18095, 47.61229], kind: "hut", note: "1 654 m · lunch", labelSide: "below" },
    { id: "schiestlhaus", name: "Schiestlhaus", at: [15.14835, 47.62216], kind: "hut", note: "2 153 m · night Sat", labelSide: "right" },
    { id: "hochschwab", name: "Hochschwab", at: [15.14245, 47.61824], kind: "goal", note: "2 277 m", labelSide: "left" },
  ],

  maps: [
    {
      id: "overview",
      title: "Praha → Seewiesen",
      waypoints: ["praha", "budejovice", "amstetten", "mariazell", "seewiesen"],
      // OSRM, as for the Chamonix trip:
      //   curl "https://router.project-osrm.org/route/v1/driving/\
      //   14.47,50.02;15.272662,47.618563?overview=simplified&geometries=geojson"
      routeLine: [
        [14.4696, 50.0203], [14.5701, 50.0031], [14.7152, 49.9038], [14.6329, 49.6546],
        [14.6605, 49.4707], [14.7389, 49.3113], [14.7243, 49.2172], [14.5207, 49.058],
        [14.5225, 48.9786], [14.4271, 48.8402], [14.486, 48.744], [14.4422, 48.654],
        [14.52, 48.5061], [14.481, 48.3598], [14.5207, 48.3553], [14.5503, 48.2913],
        [14.5018, 48.2188], [14.6263, 48.1159], [14.9073, 48.1468], [15.0143, 48.1287],
        [15.0558, 48.0651], [15.1342, 48.0577], [15.1744, 47.9833], [15.2735, 47.9487],
        [15.3292, 47.8728], [15.2949, 47.8104], [15.3295, 47.693], [15.2727, 47.6186],
      ],
      note: "Praha → Seewiesen 384 km · D3 to Linz, the A1 to Amstetten, then over Mariazell and the Seeberg · real road geometry",
    },
    {
      id: "sat",
      title: "Sat · up to the Schiestlhaus",
      pitch: 55,
      bearing: -70,
      waypoints: ["seewiesen", "florl", "voisthaler", "schiestlhaus", "hochschwab"],
      routeLine: wayUp,
      note: "Up the Seetal past the Florlhütte to the Voisthalerhütte, then the Graf-Meran-Steig through the Dullwitz to the Schiestlhaus. About 1 250 m up.",
    },
    {
      id: "sun",
      title: "Sun · Hochschwab",
      pitch: 55,
      bearing: -70,
      waypoints: ["schiestlhaus", "hochschwab", "voisthaler", "seewiesen"],
      routeLine: [...summitLine.slice().reverse(), ...summitLine, ...wayUp.slice().reverse()],
      note: "Half an hour from the hut to the summit cross, back to the hut, then down the same way to the car at Seewiesen.",
    },
  ],

  pins: [
    {
      when: "Sat",
      what: "Praha → Seewiesen · 384 km",
      sub: "About 5 h, plus a stop. Holiday weekend in Austria — allow longer.",
      cost: "—",
      href: dir("Praha", "Seewiesen, Turnau, Austria"),
      linkLabel: "Route ↗",
    },
    {
      when: "Sat hike",
      what: <b>Seewiesen car park</b>,
      sub: "Where the Seetal road ends, on the Seeberg road between Mariazell and Aflenz. The car stays overnight.",
      cost: "—",
      href: maps("47.61856,15.27266"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Night",
      what: <b>Schiestlhaus, 2 153 m</b>,
      sub: (
        <>
          Open 14 May – 26 Oct 2026. <b>Bookings by phone only</b>, weekdays ~10–12:{" "}
          <span className="mono">+43 699 108 121 99</span>. No email, SMS or voicemail.
        </>
      ),
      cost: "—",
      href: "https://www.schiestlhaus.at",
      linkLabel: "Hut ↗",
    },
    {
      when: "Backup",
      what: <b>Voisthalerhütte, 1 654 m</b>,
      sub: "Open until 26 Oct. If the Schiestlhaus is full — Sunday is then 2½ h to the summit and 4 h down.",
      cost: "—",
      href: "https://www.hut-reservation.org/reservation/book-hut/490/wizard",
      linkLabel: "Book ↗",
    },
    {
      when: "Sun",
      what: "Seewiesen → Praha · 384 km",
      cost: "—",
      href: dir("Seewiesen, Turnau, Austria", "Praha"),
      linkLabel: "Route ↗",
    },
  ],

  pinsNote: (
    <>
      Trail map: <a href="https://www.austrianmap.at/">ÖK austrianmap</a> · conditions:{" "}
      <a href="https://www.schiestlhaus.at">the Schiestlhaus</a>, phone{" "}
      <span className="mono">+43 699 108 121 99</span>.
    </>
  ),

  flagsTitle: "Late October · what's different",
  flags: [
    <>
      <b>Switched from the Großer Priel on 20 Oct.</b> Snow and wind are forecast in the Totes
      Gebirge for the weekend. The Hochschwab has the best Sunday in Austria within 5 h of Praha:
      about 70% dry, no new snow.
    </>,
    <>
      <b>No via ferrata on this route.</b> The Graf-Meran-Steig is T3 with a few handrail
      cables, like the Priel. <b>Don&rsquo;t go up the G&rsquo;hackte</b> from the Bodenbauer —
      that is the A/B via ferrata.
    </>,
    <>
      <b>Saturday turns wet from about 13:00–15:00</b>, snow at the hut by evening. Be walking by
      10:00 to be at the hut before the worst of it.
    </>,
    <>
      <b>Sunday wind.</b> One model has 70–95 km/h gusts until midday, the ensemble only ~30. If
      it&rsquo;s blowing, skip the sunrise and go up after breakfast. Rain then −4 °C overnight
      means ice on the rock — microspikes.
    </>,
    <>
      <b>Both huts close on Mon 26 Oct</b>, the Austrian national holiday. Last weekend of the
      season — phone the Schiestlhaus now.
    </>,
    <>
      <b>Austrian vignette: the 10-day one, €12.80.</b> One day doesn&rsquo;t cover a Sat–Sun.
      Buy it on shop.asfinag.at; the 10-day one is valid straight away.
    </>,
  ],

  days: [
    {
      date: "24",
      title: "Sat · Praha → Schiestlhaus",
      meta: "384 km · +1 250 m on foot",
      mapId: "sat",
      legs: [
        { time: "04:30", text: <>D3 south past České Budějovice. <b>Fuel up in Czechia.</b></> },
        { time: "~07:00", text: <>Into Austria, past Linz onto the A1 east to Amstetten.</> },
        { time: "~08:30", text: <>South over Mariazell and up to the Seeberg road.</> },
        { time: "~09:45", text: <><b>Seewiesen car park</b>, ~940 m. Boots on.</> },
        { time: "10:00", text: <>Walking, up the Seetal on the forest road, past the Florlhütte.</> },
        { time: "~12:30", text: <><b>Voisthalerhütte, 1 654 m.</b> Soup and a break.</> },
        {
          time: "~14:30",
          text: (
            <>
              <b>Schiestlhaus, 2 153 m</b>, after the Graf-Meran-Steig through the Dullwitz.
              Check in before the rain.
            </>
          ),
        },
        { time: "18:00", text: <>Dinner. Ask the hut about ice on the summit path.</> },
        { time: "21:00", text: <>Sleep. Clocks go back tonight — alarm 05:30 new time.</> },
      ],
      note: (
        <>
          The way up is komoot&rsquo;s{" "}
          <a href="https://www.komoot.com/tour/111843032" target="_blank" rel="noreferrer">
            Schiestlhaus → Seewiesen
          </a>{" "}
          walked in reverse: 12 km, +1 250 m, about 4½ h up. Sunset ~17:50.
        </>
      ),
    },
    {
      date: "25",
      title: "Sun · Hochschwab → Praha",
      meta: "+130 m · −1 350 m · 2 277 m",
      mapId: "sun",
      legs: [
        { time: "06:00", text: <>Headtorches, up to the summit. Only if the wind allows.</> },
        {
          time: "~06:45",
          text: (
            <>
              <b>Hochschwab, 2 277 m.</b> Sunrise from the cross — the Ötscher, Rax and Schneeberg
              to the east, the Gesäuse west.
            </>
          ),
        },
        { time: "07:30", text: <><b>Breakfast at the hut</b>, kitchen from 07:00. Pack up.</> },
        { time: "08:30", text: <>Down the Graf-Meran-Steig. Slow on the cables if they&rsquo;re iced.</> },
        { time: "~10:00", text: <>Voisthalerhütte.</> },
        { time: "~12:30", text: <>Seewiesen. Boots off.</> },
        { time: "~18:00", text: <>Praha. 5 h driving, ~5½ with a stop.</> },
      ],
      note: (
        <>
          <b>Windy morning?</b> Breakfast first, summit ~09:00, back at the hut by 10:00 — then
          the car around 14:00 and Praha by ~19:30. Sunset 16:50.
        </>
      ),
    },
  ],

  // Every link opened and checked on 20 Oct 2026.
  hikes: [
    {
      name: "Seewiesen ↔ Schiestlhaus via the Voisthalerhütte",
      href: "https://www.komoot.com/tour/111843032",
      when: "Hochschwab · Sat up, Sun down",
      km: "12.0 km",
      ascent: "+1 250 m",
      time: "4 h 32",
      high: "2 153 m",
      grade: "T3",
      note: (
        <>
          <b>The plan.</b> Komoot&rsquo;s track runs downhill; walk it the other way on Saturday.
          No via ferrata — ksuppan.at describes it as the way up for anyone who doesn&rsquo;t
          want ladders or a via ferrata.{" "}
          <a href="https://www.komoot.com/highlight/115935" target="_blank" rel="noreferrer">
            Schiestlhaus ↗
          </a>{" "}
          ·{" "}
          <a href="https://www.komoot.com/highlight/115939" target="_blank" rel="noreferrer">
            Summit ↗
          </a>
        </>
      ),
    },
  ],

  hikesNote: (
    <>
      <b>Picked on 20 Oct</b> from the ECMWF ensemble across fifteen peaks within 5 h of Praha:
      the best Austrian Sunday, a staffed hut half an hour below the top, and no via ferrata.
    </>
  ),

  pack: [
    {
      title: "Hiking",
      items: [
        { label: "Boots, broken in" },
        { label: <b>Microspikes</b>, sub: "Rain then frost — ice on the rock Sunday morning" },
        { label: "Trekking poles", sub: "1 350 m of descent on Sunday" },
        { label: "Gloves you can grip a cable in", sub: "Cold steel at 2 000 m" },
        { label: "Headtorch + spares", sub: "Sunrise summit in the dark" },
        { label: "1½ L water each", sub: "Refill at the huts" },
        { label: "Trail food for both days" },
        { label: "First aid, blisters, foil blanket" },
        { label: "Sunglasses, SPF" },
      ],
    },
    {
      title: "Clothes",
      items: [
        { label: "Base layer + fleece" },
        { label: <b>Insulated jacket</b>, sub: "−4 °C plus wind at sunrise" },
        { label: <b>Waterproof jacket + overtrousers</b>, sub: "Saturday afternoon is wet" },
        { label: "Warm hat, buff" },
        { label: "Spare socks + a dry set for the drive home" },
      ],
    },
    {
      title: "Hut",
      items: [
        { label: <b>Sleeping-bag liner</b>, sub: "Compulsory at the Schiestlhaus" },
        { label: "Hut slippers or light socks" },
        { label: "Earplugs", sub: "Last weekend of the season — full dorms" },
        { label: "Toiletries + small towel" },
        { label: "Cash in EUR", sub: "Don't count on the card reader" },
        { label: "Alpenverein / ÖTK card, if you have one", sub: "Member discount on the night" },
      ],
    },
    {
      title: "Car & docs",
      items: [
        { label: "ID, licence, registration" },
        { label: <b>Austrian 10-day vignette</b>, sub: "shop.asfinag.at" },
        { label: "Czech dálniční známka" },
        { label: "Hi-vis vests, triangle, first aid" },
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
    {
      what: (
        <>
          <b>Phone the Schiestlhaus, Sat 24 Oct for two</b>{" "}
          <span className="fine">— +43 699 108 121 99, weekdays ~10–12</span>
        </>
      ),
      when: "Now",
    },
    { what: <>Cancel the Prielschutzhaus booking</>, when: "Now" },
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
          <b>Last forecast check: wind on Sunday morning</b>{" "}
          <span className="fine">— GeoSphere Austria</span>
        </>
      ),
      when: "Thu 22 Oct",
    },
  ],

  sources: [
    { label: "Schiestlhaus", href: "https://www.schiestlhaus.at" },
    { label: "Voisthalerhütte", href: "https://www.voisthalerhuette.com" },
    { label: "Route from Seewiesen", href: "https://www.ksuppan.at/cms/bergtouren/hochschwab-von-seewiesen" },
    { label: "ASFINAG vignette", href: "https://shop.asfinag.at/en/products/digital-vignette/" },
    { label: "Open-Meteo ensemble", href: "https://open-meteo.com/en/docs/ensemble-api" },
  ],
  sourcesNote: "hut dates as published for 2026; nothing booked yet.",
};
