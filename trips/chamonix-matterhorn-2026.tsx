import type { Trip } from "@/lib/types";

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const dir = (from: string, to: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    from,
  )}&destination=${encodeURIComponent(to)}&travelmode=driving`;

export const chamonixMatterhorn2026: Trip = {
  slug: "chamonix-matterhorn-2026",
  title: "Chamonix",
  titleAccent: "→",
  titleTail: "Matterhorn",
  dates: "25–28 Sept 2026",
  subtitle:
    "25–28 Sept 2026 · 14 people · Praha out and back · everything on foot, zero lifts",
  blurb: "14 people · Praha out and back · everything on foot, zero lifts",

  // Both hiking days are still a choice, so these span the four combinations rather
  // than quoting one. They collapse to single numbers once the routes are picked.
  stats: [
    { value: "14", label: "people" },
    { value: "1 980", label: "km driving" },
    { value: "2 150–3 370", label: "m ascent" },
    { value: "2 600–3 260", label: "m high point" },
    { value: "7½–12 h", label: "longest day" },
  ],

  waypoints: [
    // Easternmost point on the drive map — label below, or it runs off the edge.
    { id: "praha", name: "Praha", at: [14.47, 50.02], kind: "start", note: "start 06:30 Fri", labelSide: "below" },
    { id: "plzen", name: "Plzeň", at: [13.38, 49.75], kind: "stop" },
    { id: "nurnberg", name: "Nürnberg", at: [11.08, 49.45], kind: "stop" },
    { id: "karlsruhe", name: "Karlsruhe", at: [8.4, 49.01], kind: "stop" },
    { id: "basel", name: "Basel", at: [7.59, 47.55], kind: "stop", note: "into Switzerland" },
    { id: "bern", name: "Bern", at: [7.45, 46.95], kind: "stop" },
    { id: "vevey", name: "Vevey", at: [6.84, 46.46], kind: "stop" },
    { id: "martigny", name: "Martigny", at: [7.07, 46.1], kind: "stop" },
    { id: "sion", name: "Sion", at: [7.36, 46.23], kind: "stop" },
    { id: "visp", name: "Visp", at: [7.88, 46.29], kind: "stop" },
    { id: "chamonix", name: "Chamonix", at: [6.8694, 45.9237], kind: "stop", note: "1 040 m" },
    // Argentière and Randa are ~55 km apart — at drive-map zoom their dots nearly
    // touch, so the two camp labels are stacked apart vertically.
    {
      id: "argentiere",
      name: "Argentière",
      at: [6.93, 45.98],
      kind: "camp",
      note: "camp 1 · Fri, Sat",
      labelSide: "below",
    },
    { id: "trelechamp", name: "Tré-le-Champ", at: [6.933, 45.9985], kind: "stop", note: "1 417 m · ladders" },
    { id: "coldesmontets", name: "Col des Montets", at: [6.931, 46.005], kind: "stop", note: "overflow parking" },
    { id: "lacblanc", name: "Lac Blanc", at: [6.885, 45.975], kind: "goal", note: "2 352 m · Sat high point" },
    { id: "montblanc", name: "Mont Blanc", at: [6.865, 45.833], kind: "peak", note: "4 806 m" },
    // Mont Buet alternative — up the Bérard valley. Coordinates from OSM.
    { id: "lebuet", name: "Le Buet", at: [6.9204, 46.0192], kind: "start", note: "1 330 m · by train" },
    { id: "cascadeberard", name: "Cascade de Bérard", at: [6.9118, 46.02], kind: "stop", labelSide: "below" },
    { id: "refugeberard", name: "Refuge de la Pierre à Bérard", at: [6.8687, 46.003], kind: "hut", note: "1 924 m · shut by late Sept" },
    { id: "montbuet", name: "Mont Buet", at: [6.8525, 46.0248], kind: "goal", note: "3 096 m · turn back by 13:00" },
    { id: "tasch", name: "Täsch", at: [7.779, 46.069], kind: "stop", note: "terminal · CHF 16/car" },
    { id: "randa", name: "Randa", at: [7.79, 46.1], kind: "camp", note: "camp 2 · Sun", labelSide: "above" },
    { id: "zermatt", name: "Zermatt", at: [7.749, 46.021], kind: "stop", note: "1 620 m · on foot 07:30" },
    { id: "zmutt", name: "Zmutt", at: [7.7017, 46.0128], kind: "stop", note: "1 936 m · ~09:00" },
    { id: "schwarzsee", name: "Schwarzsee", at: [7.711, 46.001], kind: "stop", note: "2 583 m · turn back 13:00" },
    { id: "hornlihutte", name: "Hörnlihütte", at: [7.696, 45.977], kind: "hut", note: "3 260 m · Sun high point" },
    { id: "matterhorn", name: "Matterhorn", at: [7.658, 45.976], kind: "peak", note: "4 478 m" },
    // 5-Seenweg, east side of the valley. Coordinates from OSM.
    { id: "blauherd", name: "Blauherd", at: [7.7874, 46.0169], kind: "stop", note: "2 571 m" },
    { id: "stellisee", name: "Stellisee", at: [7.8004, 46.0134], kind: "goal", note: "2 537 m · the reflection" },
    { id: "grindjisee", name: "Grindjisee", at: [7.7916, 46.0115], kind: "stop", note: "2 334 m" },
    { id: "grunsee", name: "Grünsee", at: [7.7857, 46.0056], kind: "stop", note: "2 300 m" },
    { id: "leisee", name: "Leisee", at: [7.7727, 46.015], kind: "stop", note: "2 232 m · Sunnegga" },
  ],

  maps: [
    {
      id: "overview",
      title: "Praha → Argentière → Randa",
      basemap: "osm",
      waypoints: ["praha", "nurnberg", "karlsruhe", "basel", "bern", "argentiere", "randa"],
      // Actual road geometry, not straight lines between cities. Generated with the
      // public OSRM demo server and pasted in, so there is no key, no runtime call and
      // nothing to break offline. To regenerate:
      //   curl "https://router.project-osrm.org/route/v1/driving/\
      //   14.47,50.02;6.93,45.98?overview=simplified&geometries=geojson"
      // then the same for 6.93,45.98;7.79,46.10 and concatenate.
      routeLine: [
        [14.4696, 50.0203], [14.4795, 49.9809], [14.4098, 49.9815], [14.2755, 50.0511],
        [14.2399, 50.0434], [13.748, 49.7986], [13.4691, 49.7246], [13.4145, 49.6813],
        [13.099, 49.7231], [12.9824, 49.7027], [12.8181, 49.752], [12.7401, 49.7391],
        [12.5078, 49.6323], [12.3576, 49.6185], [12.2107, 49.5652], [12.1278, 49.4548],
        [11.9699, 49.3983], [11.7975, 49.3967], [11.649, 49.4293], [11.2355, 49.4019],
        [11.019, 49.3105], [10.7691, 49.3054], [10.6386, 49.2508], [10.4191, 49.2551],
        [10.0102, 49.1728], [9.8086, 49.1732], [9.5671, 49.2176], [9.3058, 49.1567],
        [8.759, 49.2757], [8.6195, 49.2826], [8.5497, 49.1138], [8.4356, 48.9724],
        [8.1529, 48.7865], [7.9106, 48.5111], [7.8899, 48.4298], [7.7922, 48.354],
        [7.7458, 48.1965], [7.8105, 48.0479], [7.597, 47.9222], [7.5205, 47.6925],
        [7.6155, 47.545], [7.7511, 47.5231], [7.8353, 47.3444], [7.6057, 47.2201],
        [7.5729, 47.0811], [7.47, 46.9708], [7.3457, 46.8906], [7.1602, 46.8396],
        [7.0903, 46.7837], [7.067, 46.6512], [6.9238, 46.579], [6.8598, 46.4744],
        [6.9295, 46.4266], [6.928, 46.3461], [7.0341, 46.1467], [7.0974, 46.1107],
        [6.9977, 46.045], [6.9761, 46.0714], [6.9459, 46.0507], [6.9295, 45.9789],
        // Sunday: Argentière → Martigny → Sion → Visp → Täsch → Randa
        [6.9208, 45.976], [6.929, 45.9903], [6.9182, 46.0209], [6.9361, 46.0359],
        [6.9442, 46.0493], [6.9748, 46.0712], [6.9928, 46.0604], [6.9977, 46.045],
        [6.9995, 46.0582], [7.0153, 46.0658], [7.0204, 46.0756], [7.0324, 46.0802],
        [7.0642, 46.1036], [7.068, 46.089], [7.0908, 46.1009], [7.0975, 46.1147],
        [7.1562, 46.15], [7.199, 46.1628], [7.2711, 46.2073], [7.3636, 46.2239],
        [7.3884, 46.2384], [7.4286, 46.2485], [7.4599, 46.2655], [7.5342, 46.2859],
        [7.5525, 46.2854], [7.598, 46.2979], [7.6193, 46.3097], [7.6402, 46.3119],
        [7.6734, 46.3051], [7.7058, 46.3094], [7.7381, 46.3045], [7.8291, 46.3076],
        [7.8616, 46.3001], [7.8805, 46.2702], [7.876, 46.2372], [7.8679, 46.2292],
        [7.8583, 46.2233], [7.8517, 46.2138], [7.8325, 46.2081], [7.8063, 46.1824],
        [7.7905, 46.1515], [7.7925, 46.1308], [7.7847, 46.1073], [7.7882, 46.1023],
      ],
      note: "Praha → Argentière 984 km · Argentière → Randa 132 km · real road geometry",
    },
    {
      // Both Saturday candidates on one sheet, so the choice is visible at a glance.
      id: "sat",
      title: "Sat · Lac Blanc or Mont Buet",
      basemap: "swisstopo",
      waypoints: [
        "argentiere", "chamonix", "trelechamp", "coldesmontets", "lacblanc",
        "lebuet", "refugeberard", "montbuet",
      ],
      note: "Two options. Lac Blanc south-west from Tré-le-Champ up the ladders, down via Remuaz into Argentière; or Mont Buet, north-west up the Bérard valley from Le Buet and back the same way. Both start on the Mont-Blanc Express with the campsite guest card.",
    },
    {
      // Both Sunday candidates: Hörnlihütte up the west side, the lakes on the east.
      id: "sun",
      title: "Sun · Hörnlihütte or 5 Lakes",
      basemap: "swisstopo",
      waypoints: [
        "randa", "tasch", "zermatt", "zmutt", "schwarzsee", "hornlihutte", "matterhorn",
        "blauherd", "stellisee", "grindjisee", "grunsee", "leisee",
      ],
      note: "Two options from the same Zermatt start. Hörnlihütte south-west up the Zmutt valley past Schwarzsee; or the 5-Seenweg east above Sunnegga, Stellisee to Leisee.",
    },
  ],

  pins: [
    {
      when: "Fri",
      what: "Praha → Argentière · 984 km",
      cost: "—",
      href: dir("Ceneticka 2413/1a Praha", "Camping Glacier Argentiere Chamonix"),
      linkLabel: "Route ↗",
    },
    {
      when: "Camp 1",
      what: "Camping Glacier d'Argentière",
      sub: "€311 + €14 electricity · €23 each",
      cost: "€325",
      href: maps("Camping Glacier Argentiere Chamonix"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Sat run",
      what: "Centre Sportif Richard Bozon, Chamonix",
      cost: "Free",
      href: maps("Centre Sportif Richard Bozon Chamonix"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Sat hike",
      what: <b>Parking de Tré-le-Champ</b>,
      sub: "Roadside lay-by — will not hold 4 cars. Take the bus.",
      cost: "Free",
      href: maps("Tre-le-Champ Chamonix parking"),
      linkLabel: "Pin ↗",
    },
    {
      when: "↳ full?",
      what: "Parking du Col des Montets · +10 min walk",
      cost: "Free",
      href: maps("Col des Montets parking"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Sun",
      what: <b>Matterhorn Terminal Täsch</b>,
      sub: "CHF 11 in the garage over the road",
      cost: (
        <>
          CHF 16<span className="fine">/car</span>
        </>
      ),
      href: maps("Matterhorn Terminal Tasch"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Camp 2",
      what: "Camping Attermenzen, Randa",
      sub: "CHF 22 each",
      cost: "CHF 305",
      href: maps("Camping Attermenzen Randa"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Mon",
      what: "Randa → Praha · 862 km",
      cost: "—",
      href: dir("Camping Attermenzen Randa", "Ceneticka 2413/1a Praha"),
      linkLabel: "Route ↗",
    },
  ],

  pinsNote: (
    <>
      Trail maps: <a href="https://map.geo.admin.ch/">SwissTopo</a> (Hörnlihütte) ·{" "}
      <a href="https://www.geoportail.gouv.fr/carte">IGN</a> (Lac Blanc).
    </>
  ),

  flagsTitle: "Convoy · 14 people, 3–4 cars",
  flags: [
    <>
      <b>Swiss vignette is CHF 40 per car</b>, not per group. Every car needs its own before the
      border — buy them all at once on via.admin.ch.
    </>,
    <>
      <b>Don’t drive in convoy.</b> Over 980 km you will separate at the first services.
      Agree fuel stops and a Martigny meeting point instead, and put one person from each car in a
      group chat.
    </>,
    <>
      <b>Saturday, leave the cars at camp.</b> Tré-le-Champ is a roadside lay-by that fills early —
      four cars won’t fit and the loop ends back at the campsite anyway. The Chamonix Bus and
      Mont-Blanc Express are free with the guest card you get at check-in.
    </>,
    <>
      <b>Sunday, Täsch is CHF 16 per car</b> per day. Split the cars across both garages if the main
      one is full — the one over the road is CHF 11.
    </>,
    <>
      <b>Email RandaBoulder before you book 14 entries.</b> It’s 250 m² across two floors and
      unstaffed; a group that size needs warning, and possibly a slot.
    </>,
  ],

  days: [
    {
      date: "25",
      title: "Fri · Praha → Argentière",
      meta: "984 km",
      mapId: "overview",
      legs: [
        {
          time: "06:30",
          text: (
            <>
              D5 → Nürnberg, then A6/A8 west toward Karlsruhe. <b>Fuel up in Czechia.</b>
            </>
          ),
        },
        {
          time: "~13:30",
          text: (
            <>
              Down the A5 past Freiburg and into Switzerland at <b>Basel</b>.{" "}
              <b>Vignette already on the car.</b>
            </>
          ),
        },
        { time: "~15:30", text: <>Bern → Vevey → Martigny. Driver swap.</> },
        { time: "~19:00", text: <>Arrive. Sunset 19:25 — pitch fast.</> },
      ],
      note: <>Buy food in Germany or Martigny; you pass Chamonix after closing.</>,
    },
    {
      date: "26",
      title: "Sat · Chamonix — pick one",
      meta: "two options",
      mapId: "sat",
      legs: [],
      options: [
        {
          name: "Lac Blanc + the 5 km track",
          href: "https://www.komoot.com/smarttour/e934061622/von-flegere-zum-col-des-montets-ueber-den-lac-blanc-chamonix-mont-blanc-schleife",
          meta: "16.6 km · +1 180 m · 2 352 m",
          legs: [
        {
          time: "07:00",
          text: (
            <>
              <b>5 km easy at the Chamonix track</b> — 12½ laps, 25–30 min. At 1 040 m the first km
              lies to you.
            </>
          ),
        },
        {
          time: "08:15",
          text: (
            <>
              <b>Free Chamonix Bus or Mont-Blanc Express</b> to Tré-le-Champ / Montroc — free with
              the campsite guest card, and it beats squeezing four cars into a lay-by.
            </>
          ),
        },
        {
          time: "08:30",
          text: (
            <>
              Forest, then <b>the ladders</b> — climb them, don’t downclimb.
            </>
          ),
        },
        {
          time: "~12:30",
          text: (
            <>
              <b>Lac Blanc, 2 352 m.</b> Refuge shut — carry everything.
            </>
          ),
        },
        { time: "~13:45", text: <>Down via Remuaz straight into Argentière. 1 100 m; poles.</> },
        {
          time: "~17:00",
          text: (
            <>
              Camp. Shop, <b>pack everything but sleeping gear.</b>
            </>
          ),
        },
            { time: "21:00", text: <>Sleep. Alarm 04:00.</> },
          ],
          note: (
            <>
              <b>The ladders are single-file.</b> Fourteen people plus other parties means 30–45 min
              of queuing — start early and the trail is yours.{" "}
              <b>Anyone who dislikes heights should walk the loop backwards:</b> up via Remuaz, meet
              everyone at Lac Blanc, no ladders at all. Track gated? Run from camp toward Le
              Lavancher. Rain? Petit Balcon Sud, ~3 h under trees.
            </>
          ),
        },
        {
          name: "Mont Buet",
          href: "https://www.komoot.com/smarttour/e924134691/mont-buet-via-vallorcine-chamonix-mont-blanc",
          meta: "19.8 km · +1 730 m · 3 096 m",
          legs: [
            {
              time: "06:00",
              text: (
                <>
                  <b>No morning run</b> — this day needs the daylight. Breakfast, then the
                  Mont-Blanc Express from Argentière to Le Buet, ~10 min, free on the guest card.
                </>
              ),
            },
            { time: "07:00", text: <>Walking from Le Buet, 1 330 m, up the Bérard valley.</> },
            { time: "~07:40", text: <>Cascade de Bérard. Forest, then the valley opens out.</> },
            {
              time: "~09:15",
              text: (
                <>
                  <b>Refuge de la Pierre à Bérard, 1 924 m.</b> Shut by late Sept — carry
                  everything. Last water.
                </>
              ),
            },
            {
              time: "~12:30",
              text: (
                <>
                  <b>Mont Buet, 3 096 m.</b> Mont Blanc massif front to back.
                </>
              ),
            },
            {
              time: "13:00",
              text: (
                <b>
                  <em>Hard turn-back, on the summit or not.</em>
                </b>
              ),
            },
            { time: "~15:00", text: <>Back past the refuge. 1 766 m of descent; poles.</> },
            { time: "~17:30", text: <>Le Buet. Train back to Argentière, shop, camp.</> },
            { time: "21:00", text: <>Sleep. Alarm 04:00.</> },
          ],
          note: (
            <>
              <b>10–11 h for fourteen</b> against komoot’s 8 h 07 for one fit hiker, so the
              13:00 turn-back is the whole plan — sunset is 19:25 and there is no hut to wait in.{" "}
              <b>The summit is above 3 000 m and exposed:</b> snow is likely by late Sept, so
              microspikes, and it is a genuine cold-and-wind day, not a valley walk. It also costs
              +580 m more than Lac Blanc the day before Zermatt.
            </>
          ),
        },
      ],
    },
    {
      date: "27",
      title: "Sun · Zermatt — pick one",
      meta: "two options",
      mapId: "sun",
      legs: [],
      options: [
        {
          name: "Hörnlihütte",
          href: "https://www.komoot.com/smarttour/7904022",
          meta: "23 km · ±1 640 m · 3 260 m",
          legs: [
            { time: "04:30", text: <>Depart in convoy → Martigny → Sion → Visp → Täsch. 2 h 20.</> },
            {
              time: "07:12",
              text: (
                <>
                  Shuttle to Zermatt. Every 20 min from 05:55 — 14 people won’t fit one departure,
                  so agree a meeting point <b>in Zermatt</b>, not on the platform.
                </>
              ),
            },
            { time: "07:30", text: <>All 14 on foot from 1 620 m, up the Zmutt valley.</> },
            {
              time: "~09:00",
              text: (
                <>
                  <b>Zmutt</b>, 1 936 m — larch hamlet, north face overhead.
                </>
              ),
            },
            { time: "~11:30", text: <>Schwarzsee, 2 583 m. Regroup, eat, refill.</> },
            {
              time: "13:00",
              text: (
                <b>
                  <em>Hard turn-back at Schwarzsee.</em> Past this and the descent finishes in the
                  dark.
                </b>
              ),
            },
            {
              time: "~14:00",
              text: (
                <>
                  <b>Hörnlihütte, 3 260 m.</b> Kitchen shut for the season — carry everything.
                </>
              ),
            },
            { time: "~18:30", text: <>Back in Zermatt via Furi. Sunset 19:15.</> },
            { time: "~19:30", text: <>Randa. Tents up in the dark; head torches out before you start.</> },
          ],
          note: (
            <>
              <b>The honest number: 11–12 h for fourteen.</b> 9½ h is a fit-pair figure and a group
              this size adds 20–30% in regrouping, eating and queueing — so the tail of the
              1 640 m descent is by head torch, and everyone needs a working one. Around freezing at
              3 260 m with cables and metal steps: <b>microspikes, and turn back if it is iced.</b>
            </>
          ),
        },
        {
          name: "5-Seenweg — Stellisee & the lakes",
          href: "https://www.komoot.com/smarttour/1713407",
          meta: "14 km · +580 m · 2 600 m",
          legs: [
            { time: "05:30", text: <>Depart → Täsch. An hour more sleep than the Hörnli day.</> },
            { time: "08:12", text: <>Shuttle to Zermatt, on foot from 1 620 m.</> },
            {
              time: "~10:30",
              text: (
                <>
                  <b>Blauherd, 2 571 m</b> on foot — the climb the lift usually does.
                </>
              ),
            },
            {
              time: "~11:00",
              text: (
                <>
                  <b>Stellisee, 2 537 m.</b> The reflection shot. Wind flat by mid-morning or not at
                  all.
                </>
              ),
            },
            { time: "~12:00", text: <>Grindjisee, 2 334 m — larches, the quiet one.</> },
            { time: "~13:00", text: <>Grünsee, 2 300 m. Then Moosjisee and down.</> },
            { time: "~14:00", text: <>Leisee, 2 232 m, above Sunnegga.</> },
            { time: "~15:30", text: <>Zermatt. Shuttle to Täsch.</> },
            { time: "~16:30", text: <>Randa in daylight. Tents up, then RandaBoulder at 19:45.</> },
          ],
          note: (
            <>
              <b>Komoot’s 5 h 08 and +580 m assume the Sunnegga funicular and Blauherd gondola
              for the climb.</b>{" "}
              Walking it from Zermatt is nearer <b>+970 m and ~7½ h</b>, which is the version timed
              above and the one that keeps this trip lift-free. Take the lifts and it is a half day —
              but check they are running, and that is a cost per head for fourteen. Either way the
              whole group stays together and reaches Randa in daylight.
            </>
          ),
        },
      ],
    },
    {
      date: "28",
      title: "Mon · Randa → Praha",
      meta: "862 km",
      mapId: "overview",
      legs: [
        { time: "06:30", text: <>Visp → Bern → Basel → Nürnberg → Plzeň.</> },
        { time: "~18:30", text: <>Home. 10 h driving, ~12 h with stops.</> },
      ],
    },
  ],

  // Stats are komoot's own for each tour. Verified against the live pages —
  // if you add one, open it first: komoot retires smart tours and returns 410.
  hikes: [
    {
      name: "Lac Blanc & Lacs des Chéserys loop",
      href: "https://www.komoot.com/smarttour/e934061622/von-flegere-zum-col-des-montets-ueber-den-lac-blanc-chamonix-mont-blanc-schleife",
      when: "Chamonix · Sat",
      km: "16.6 km",
      ascent: "+1 180 m",
      time: "7 h 54",
      high: "2 350 m",
      grade: "Hard",
      note: (
        <>
          The Chésérys ladders. <b>This is the planned Saturday.</b>
        </>
      ),
    },
    {
      name: "Mont Buet via Vallorcine",
      href: "https://www.komoot.com/smarttour/e924134691/mont-buet-via-vallorcine-chamonix-mont-blanc",
      when: "Chamonix · Sat",
      km: "19.8 km",
      ascent: "+1 730 m",
      time: "8 h 07",
      high: "3 096 m",
      grade: "Hard",
      note: (
        <>
          Out and back from the Vallorcine bus stop, so the cars still stay at camp.{" "}
          <b>10–11 h for fourteen</b> — it does not combine with the morning run, and it is
          +1 730 m the day before Zermatt.
        </>
      ),
    },
    {
      name: "Hörnligrat – Schwarzsee loop",
      href: "https://www.komoot.com/smarttour/7904022",
      when: "Zermatt · Sun",
      km: "11.0 km",
      ascent: "+840 m",
      time: "5 h 51",
      high: "3 210 m",
      grade: "Hard",
      note: <>From Schwarzsee only — add the Zermatt → Zmutt → Schwarzsee approach for the full day.</>,
    },
    {
      name: "5-Seenweg — Stellisee & the lakes",
      href: "https://www.komoot.com/smarttour/1713407",
      when: "Zermatt · Sun",
      km: "14.0 km",
      ascent: "+580 m",
      time: "5 h 08",
      high: "2 600 m",
      grade: "Hard",
      note: (
        <>
          East side of the valley. <b>Those figures assume the Sunnegga and Blauherd lifts</b> —
          on foot from Zermatt it is nearer +970 m and 7½ h, which is how it is timed on Sunday.
        </>
      ),
    },
    {
      name: "Zermatt – Zmutt – Furi loop",
      href: "https://www.komoot.com/tour/32054192",
      when: "Zermatt · Sun",
      km: "11.2 km",
      ascent: "+630 m",
      time: "4 h 53",
      high: "2 070 m",
      grade: "Moderate",
      note: <>Shortest Sunday. No Hörnlihütte, no lift question, back in Zermatt early.</>,
    },
  ],

  hikesNote: (
    <>
      <b>Komoot times are for one fit hiker.</b> Fourteen people regrouping, eating and queueing
      adds 20–30% — that is what turns a 9½ h Sunday into 11–12 h. Snow fell to{" "}
      <b>1 900–2 200 m</b> in each of Sept 2024 and 2025, so anything above 3 000 m should be
      assumed white. Pick the routes a week out, once there is a real forecast.
    </>
  ),

  pack: [
    {
      title: "Hiking",
      items: [
        { label: "Boots, broken in" },
        { label: <b>Microspikes</b>, sub: "Snow fell to 1 900–2 200 m in Sept 2024 and 2025" },
        { label: "Trekking poles", sub: "2 740 m of descent in two days" },
        { label: <b>3 L water for Sunday</b>, sub: "No open hut on the route" },
        { label: "Headtorch + spares" },
        { label: "Cat-3 sunglasses, SPF 50" },
        { label: "Base + fleece + wind + waterproof" },
        { label: "Warm hat + gloves" },
        { label: "First aid, blisters, tape" },
        { label: "Foil blanket, power bank" },
        { label: "Trail food, both days" },
      ],
    },
    {
      title: "Camping",
      items: [
        { label: <b>Bag rated −5 °C</b>, sub: "Frost possible at both sites" },
        { label: "Mat, R-value 3+" },
        { label: "Tent, footprint, stony pegs" },
        { label: "Stove, gas, pot, two lighters" },
        { label: "Thermals, dry socks, beanie" },
        { label: "Camp shoes" },
        { label: "Towel, toiletries, shower coins" },
        { label: "Bin bags, washing-up" },
      ],
    },
    {
      title: "Run & boulder",
      items: [
        { label: "Road shoes" },
        { label: "Shorts + long sleeve", sub: "5–8 °C at 07:00" },
        { label: "Climbing shoes, chalk, brush" },
        { label: "Finger tape" },
        { label: <b>RandaBoulder app + entry</b>, sub: "Buy from home" },
      ],
    },
    {
      title: "Car & docs",
      items: [
        { label: "ID, licence, registration, green card" },
        { label: <b>Swiss e-vignette CHF 40</b>, sub: "via.admin.ch" },
        { label: "Czech dálniční známka" },
        { label: "Hi-vis vests", sub: "Reachable from inside, not the boot" },
        { label: "Triangle, first aid, bulbs" },
        {
          label: (
            <>
              Cash: EUR <b>and</b> CHF
            </>
          ),
        },
        { label: "Offline maps", sub: "No signal in the Mattertal" },
        {
          label: (
            <>
              <span className="mono">112</span> · <span className="mono">1414</span> Rega ·{" "}
              <span className="mono">+33 4 50 53 16 89</span>
            </>
          ),
        },
        { label: "Chargers, 12 V splitter, mount" },
      ],
    },
  ],

  prep: [
    {
      what: (
        <>
          Book Argentière, 2 nights <span className="fine">— season ends 30 Sept</span>
        </>
      ),
      when: "Now",
    },
    { what: "Book Attermenzen, 1 night", when: "Now" },
    {
      what: (
        <>
          Swiss e-vignette <span className="fine">— CHF 40 × every car, via.admin.ch</span>
        </>
      ),
      when: "Now",
    },
    {
      what: (
        <>
          Email RandaBoulder <span className="fine">— 14 entries, unstaffed hall</span>
        </>
      ),
      when: "Now",
    },
    { what: "Confirm the track is open", when: "20 Sept" },
    { what: "Name a route leader and a sweep — the group stays together", when: "Before you go" },
    {
      what: (
        <>
          <b>Agree both turn-back times</b>{" "}
          <span className="fine">— 13:00 on Mont Buet, 13:00 at Schwarzsee</span>
        </>
      ),
      when: "Before you go",
    },
    {
      what: (
        <>
          <b>Forecast + snow line — pick the hikes</b>{" "}
          <span className="fine">— Météo-France montagne, SLF for the Swiss side</span>
        </>
      ),
      when: "1 week out",
    },
    { what: "Re-check forecast + webcams", when: "3 days out" },
  ],

  sources: [
    { label: "Chamonix lifts", href: "https://www.chamonix.net/english/lift-systems/dates-times" },
    { label: "Argentière camp", href: "https://www.campingchamonix.com/en/home/" },
    { label: "Zermatt", href: "https://www.matterhornparadise.ch/en/information/lifts-and-pistes" },
    { label: "Hörnlihütte", href: "https://hoernlihuette.ch/" },
    { label: "RandaBoulder", href: "https://www.randaboulder.ch/" },
    { label: "Attermenzen", href: "https://www.campingranda.ch/" },
  ],
  sourcesNote:
    "campsite totals are your booked prices; parking is the 2026 published rate.",
};
