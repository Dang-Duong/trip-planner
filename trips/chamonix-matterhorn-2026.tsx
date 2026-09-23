import type { LngLat, Trip } from "@/lib/types";

// Trail geometry for the two hiking days, drawn on each day's map. Routed once on the
// public BRouter server (free, no key) and pasted in, then simplified to ~12 m.
// To regenerate a route:
//   curl "https://brouter.de/brouter?lonlats=<lon,lat>|<lon,lat>&profile=hiking-beta&format=geojson"
// one leg at a time — its watchdog kills long multi-leg requests. The 5 lakes line is
// komoot's own track for smart tour 43215776, the loop Sunday follows.

const montbuetTrail: LngLat[] = [
  [6.92037, 46.01908], [6.92015, 46.01925], [6.91976, 46.01922], [6.91988, 46.01861],
  [6.91888, 46.0186], [6.91789, 46.01883], [6.91733, 46.01869], [6.91592, 46.01928],
  [6.91485, 46.01936], [6.91462, 46.02024], [6.91438, 46.02026], [6.9143, 46.02011],
  [6.91294, 46.02], [6.9128, 46.01982], [6.91183, 46.02], [6.91192, 46.0199],
  [6.9115, 46.01975], [6.91096, 46.01979], [6.91046, 46.01957], [6.90891, 46.01935],
  [6.90792, 46.01942], [6.90727, 46.01906], [6.90459, 46.01853], [6.90393, 46.01825],
  [6.90307, 46.01821], [6.90222, 46.01839], [6.90105, 46.01763], [6.90029, 46.01772],
  [6.89917, 46.01745], [6.89802, 46.01647], [6.89529, 46.01517], [6.89526, 46.01547],
  [6.89403, 46.0149], [6.89272, 46.01467], [6.89161, 46.01393], [6.88965, 46.01339],
  [6.88848, 46.01261], [6.88782, 46.01263], [6.88711, 46.01214], [6.8871, 46.01239],
  [6.88674, 46.01205], [6.88535, 46.01154], [6.8831, 46.01038], [6.87982, 46.00814],
  [6.87847, 46.00749], [6.87675, 46.00703], [6.87549, 46.00695], [6.8744, 46.00655],
  [6.87307, 46.00547], [6.8726, 46.00454], [6.87282, 46.0041], [6.87251, 46.00424],
  [6.87209, 46.00404], [6.87199, 46.00364], [6.87127, 46.00315], [6.87093, 46.00307],
  [6.87099, 46.00337], [6.86895, 46.00297], [6.8675, 46.0037], [6.86741, 46.00416],
  [6.86706, 46.00441], [6.86636, 46.00564], [6.86359, 46.00562], [6.86351, 46.00483],
  [6.86325, 46.00467], [6.86289, 46.00476], [6.8628, 46.00501], [6.86191, 46.005],
  [6.86191, 46.00533], [6.86153, 46.00532], [6.86067, 46.0049], [6.86019, 46.00571],
  [6.85919, 46.00639], [6.85864, 46.00651], [6.85819, 46.00759], [6.85658, 46.00816],
  [6.85591, 46.0107], [6.8541, 46.011], [6.85332, 46.01129], [6.85268, 46.01197],
  [6.85118, 46.01267], [6.84996, 46.01396], [6.84978, 46.01457], [6.85169, 46.0169],
  [6.85185, 46.01781], [6.8522, 46.01812], [6.85193, 46.01835], [6.85196, 46.01883],
  [6.85132, 46.01949], [6.85157, 46.01981], [6.85, 46.02008], [6.85007, 46.02064],
  [6.84948, 46.02144], [6.85052, 46.0233], [6.85251, 46.02482],
];

const fuenfseenTrail: LngLat[] = [
  [7.75173, 46.02251], [7.75317, 46.02208], [7.75392, 46.02211], [7.75402, 46.02187],
  [7.7557, 46.02239], [7.75516, 46.02203], [7.75609, 46.02201], [7.75526, 46.02156],
  [7.7551, 46.02039], [7.75575, 46.02077], [7.75649, 46.02086], [7.75695, 46.02112],
  [7.75691, 46.02084], [7.75763, 46.02103], [7.75859, 46.02221], [7.75862, 46.02252],
  [7.75942, 46.02292], [7.75994, 46.02351], [7.76073, 46.02346], [7.76098, 46.02403],
  [7.76347, 46.02435], [7.764, 46.02556], [7.76457, 46.02504], [7.76506, 46.02546],
  [7.7664, 46.02526], [7.7677, 46.02479], [7.76783, 46.025], [7.76855, 46.02524],
  [7.76911, 46.02519], [7.77016, 46.02548], [7.77126, 46.02524], [7.77172, 46.02548],
  [7.77231, 46.02552], [7.77255, 46.02627], [7.77364, 46.02744], [7.77362, 46.02952],
  [7.77436, 46.02954], [7.77599, 46.03039], [7.77658, 46.03093], [7.77685, 46.0306],
  [7.77709, 46.02886], [7.77813, 46.02751], [7.77938, 46.02665], [7.77961, 46.02669],
  [7.77958, 46.0264], [7.7801, 46.0261], [7.78061, 46.02638], [7.78051, 46.0262],
  [7.78095, 46.02632], [7.78093, 46.02602], [7.78145, 46.02603], [7.78131, 46.02562],
  [7.78167, 46.02536], [7.78162, 46.02495], [7.78185, 46.02482], [7.78206, 46.0239],
  [7.78247, 46.02361], [7.78247, 46.02333], [7.7828, 46.0234], [7.78277, 46.02296],
  [7.78323, 46.02217], [7.78412, 46.02169], [7.78424, 46.02143], [7.7851, 46.02138],
  [7.78533, 46.02104], [7.7856, 46.02115], [7.78595, 46.02016], [7.78644, 46.02006],
  [7.78688, 46.01917], [7.78678, 46.01839], [7.78703, 46.01779], [7.78681, 46.01696],
  [7.78724, 46.01684], [7.78738, 46.0165], [7.78841, 46.01594], [7.79272, 46.01467],
  [7.79516, 46.01368], [7.79658, 46.01371], [7.79848, 46.01323], [7.79958, 46.01375],
  [7.80126, 46.01391], [7.80212, 46.01374], [7.80206, 46.0135], [7.80119, 46.01306],
  [7.79851, 46.01292], [7.79706, 46.01339], [7.79634, 46.01337], [7.79461, 46.01379],
  [7.79192, 46.01368], [7.79167, 46.0135], [7.78968, 46.01365], [7.78975, 46.01342],
  [7.78864, 46.01361], [7.78897, 46.01333], [7.78829, 46.01342], [7.78859, 46.0132],
  [7.78817, 46.01322], [7.78869, 46.01297], [7.78681, 46.01284], [7.78682, 46.01268],
  [7.78763, 46.0125], [7.78692, 46.01236], [7.78442, 46.01264], [7.7848, 46.01233],
  [7.78442, 46.01264], [7.78265, 46.01277], [7.78121, 46.01333], [7.78033, 46.01323],
  [7.77921, 46.01341], [7.77821, 46.01318], [7.77663, 46.01248], [7.7759, 46.01313],
  [7.77535, 46.01326], [7.77505, 46.01327], [7.77519, 46.01311], [7.77496, 46.01329],
  [7.77081, 46.01317], [7.77068, 46.01303], [7.77123, 46.01283], [7.77062, 46.0125],
  [7.76903, 46.01251], [7.76801, 46.01219], [7.76703, 46.01143], [7.76643, 46.01158],
  [7.76486, 46.01092], [7.76319, 46.01072], [7.76101, 46.01078], [7.75745, 46.01057],
  [7.75683, 46.01057], [7.7562, 46.01091], [7.75527, 46.01107], [7.75479, 46.01096],
  [7.75306, 46.01118], [7.75245, 46.01149], [7.75237, 46.01253], [7.75159, 46.01146],
  [7.75145, 46.01217], [7.75079, 46.01128], [7.7506, 46.01213], [7.75101, 46.01273],
  [7.75097, 46.01316], [7.7507, 46.0134], [7.75034, 46.01287], [7.75013, 46.01342],
  [7.74959, 46.01227], [7.7489, 46.01213], [7.74842, 46.01158], [7.74597, 46.01301],
  [7.74526, 46.01324], [7.74507, 46.01306], [7.74423, 46.0137], [7.74356, 46.01389],
  [7.74333, 46.01483], [7.74264, 46.01508], [7.7428, 46.01558], [7.74253, 46.01597],
  [7.74502, 46.01781], [7.74548, 46.01912], [7.74592, 46.01926], [7.74617, 46.01971],
  [7.74668, 46.01964], [7.74856, 46.02062], [7.74935, 46.02068], [7.74981, 46.02123],
  [7.75151, 46.0218], [7.75173, 46.02251],
];

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
    "25–28 Sept 2026 · 13 people · Praha out and back · everything on foot, zero lifts",
  blurb: "13 people · Praha out and back · everything on foot, zero lifts",

  // Mont Buet on Saturday and the 5 lakes on foot on Sunday.
  stats: [
    { value: "13", label: "people" },
    { value: "1 980", label: "km driving" },
    { value: "2 700", label: "m ascent" },
    { value: "3 096", label: "m high point" },
    { value: "10–11 h", label: "longest day" },
  ],

  people: [
    "Fatboi Tomáš",
    "Čongus",
    "Bobr",
    "FandusChcankus",
    "Vien",
    "Hokage",
    "Paprikason",
    "BMLock-in",
    "Filipino",
    "Crispy Pork Davinki",
    "FemboiTommy",
    "Tuty",
    "Meloun",
  ],
  noAlcohol: ["Tuty", "Meloun"],

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
      at: [6.9242, 45.9748],
      kind: "camp",
      note: "camp 1 · Fri, Sat",
      labelSide: "below",
    },
    { id: "montblanc", name: "Mont Blanc", at: [6.865, 45.833], kind: "peak", note: "4 806 m" },
    // Saturday: Mont Buet, up the Bérard valley. Coordinates from OSM.
    { id: "lebuet", name: "Le Buet", at: [6.9204, 46.0192], kind: "start", note: "1 330 m · car park" },
    { id: "cascadeberard", name: "Cascade de Bérard", at: [6.9118, 46.02], kind: "stop", labelSide: "below" },
    { id: "refugeberard", name: "Refuge de la Pierre à Bérard", at: [6.8687, 46.003], kind: "hut", note: "1 924 m · likely shut — no water" },
    { id: "montbuet", name: "Mont Buet", at: [6.8525, 46.0248], kind: "goal", note: "3 096 m · turn back by 13:00" },
    { id: "tasch", name: "Täsch", at: [7.777, 46.0677], kind: "stop", note: "terminal · CHF 16/car" },
    { id: "randa", name: "Randa", at: [7.7823, 46.0857], kind: "camp", note: "camp 2 · Sun", labelSide: "above" },
    { id: "zermatt", name: "Zermatt", at: [7.7493, 46.0212], kind: "stop", note: "1 620 m · on foot ~08:30" },
    { id: "matterhorn", name: "Matterhorn", at: [7.6586, 45.9766], kind: "peak", note: "4 478 m" },
    // 5-Seenweg, east side of the valley. Coordinates from OSM.
    { id: "blauherd", name: "Blauherd", at: [7.7874, 46.0169], kind: "stop", note: "2 571 m" },
    { id: "stellisee", name: "Stellisee", at: [7.8004, 46.0134], kind: "goal", note: "2 537 m · the reflection" },
    { id: "grindjisee", name: "Grindjisee", at: [7.7916, 46.0115], kind: "stop", note: "2 334 m" },
    { id: "leisee", name: "Leisee", at: [7.7727, 46.015], kind: "stop", note: "2 232 m · Sunnegga" },
  ],

  maps: [
    {
      id: "overview",
      title: "Praha → Argentière → Randa",
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
      id: "sat",
      title: "Sat · Mont Buet",
      waypoints: ["argentiere", "lebuet", "refugeberard", "montbuet"],
      routeLine: montbuetTrail,
      note: "Drive from Argentière to the car park at Le Buet, about ten minutes, then north-west up the Bérard valley past the refuge to the summit, and back the same way.",
    },
    {
      id: "sun",
      title: "Sun · 5 Lakes",
      // Framed on the hike: with Randa and the Matterhorn in view the five lakes shrink to
      // one knot of overlapping labels. The drive to Täsch is on the overview map.
      waypoints: ["zermatt", "blauherd", "stellisee", "grindjisee", "leisee"],
      routeLine: fuenfseenTrail,
      note: "Shuttle from Täsch, then komoot's loop on foot from the Sunnegga valley station: up to Blauherd, Stellisee, above Grindjisee, past Moosjisee and Leisee, and down through Findeln to Zermatt.",
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
      sub: "€311 + €14 electricity · €25 each",
      cost: "€325",
      href: maps("Camping Glacier Argentiere Chamonix"),
      linkLabel: "Pin ↗",
    },
    {
      when: "Sat hike",
      what: <b>Parking du Buet</b>,
      sub: "10 min from camp. First 2 h free, then €5 a car for the day. Fills by mid-morning in summer — be parked by 06:45.",
      cost: (
        <>
          €5<span className="fine">/car</span>
        </>
      ),
      href: maps("Parking du Buet Vallorcine"),
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
      sub: "CHF 24 each · cash only, CHF or EUR · no reservations · check-in 08:00–19:00",
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
      Trail maps: <a href="https://map.geo.admin.ch/">SwissTopo</a> (the 5 lakes) ·{" "}
      <a href="https://www.geoportail.gouv.fr/carte">IGN</a> (Mont Buet).
    </>
  ),

  flagsTitle: "Convoy · 13 people, 3–4 cars",
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
      <b>Saturday, drive to Le Buet.</b> It is 6.5 km and about ten minutes from camp, and the car
      park is a few minutes’ walk from the path — €5 a car for the day. It fills by mid-morning in
      summer, so be parked by 06:45. There may be temporary traffic lights for roadworks on the
      RD1506; allow a few extra minutes.
    </>,
    <>
      <b>Sunday, Täsch is CHF 16 per car</b> per day. Split the cars across both garages if the main
      one is full — the one over the road is CHF 11.
    </>,
    <>
      <b>Email RandaBoulder before you book 13 entries.</b> It’s 250 m² across two floors and
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
      title: "Sat · Vallorcine — Mont Buet",
      meta: "19.8 km · +1 730 m · 3 096 m",
      mapId: "sat",
      legs: [
        { time: "06:00", text: <><b>Breakfast, packed</b> — this day needs the daylight.</> },
        {
          time: "06:30",
          text: (
            <>
              <b>Drive to Le Buet</b>, 6.5 km, ~10 min. Parking du Buet, €5 a car for the day — the
              path starts a few minutes’ walk away.
            </>
          ),
        },
        { time: "07:00", text: <>Walking from Le Buet, 1 330 m, up the Bérard valley.</> },
        { time: "~07:40", text: <>Cascade de Bérard. Forest, then the valley opens out.</> },
        {
          time: "~09:15",
          text: (
            <>
              <b>Refuge de la Pierre à Bérard, 1 924 m.</b> Likely shut for the season — carry all
              your water from camp, 2½–3 L each.
            </>
          ),
        },
        {
          time: "~11:00",
          text: (
            <>
              <b>The boulder field</b>, marked with white poles, then very short, steep zigzags up
              to the ridge. Spread out, poles in hand, nobody standing below someone on the blocks.
            </>
          ),
        },
        {
          time: "~12:30",
          text: (
            <>
              <b>Mont Buet, 3 096 m.</b> Mont Blanc massif front to back. Old hard snow can sit
              just below the top — walk round it on rock, or use microspikes if you have them.
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
        { time: "~17:30", text: <>Le Buet. Drive back by way of the supermarket — the cars carry the Saturday shop — then camp.</> },
        { time: "21:00", text: <>Sleep. Alarm 04:00.</> },
      ],
      note: (
        <>
          <b>10–11 h for thirteen</b> against{" "}
          <a href="https://www.komoot.com/smarttour/e924134691/mont-buet-via-vallorcine-chamonix-mont-blanc" target="_blank" rel="noreferrer">
            komoot’s 8 h 07
          </a>{" "}
          for one fit hiker, so the 13:00 turn-back is the whole plan — sunset is 19:22 and there
          is no hut to wait in. <b>It is out and back, and that is the safety valve:</b> anyone
          slower can turn round at any point and walk down to Le Buet, in pairs agreed at the
          car park, never alone. <b>Send a driver down with the first pair back,</b> so their car
          can leave and nobody sits for hours waiting on a key. Picked on the 23 Sept forecast: clear and dry, gusts around 25 km/h
          on top, 1–9 °C and feeling like −3 early, and no snowfall at 3 096 m in 45 days.
        </>
      ),
    },
    {
      date: "27",
      title: "Sun · Zermatt — the 5 lakes",
      meta: "15.1 km · +970 m · 2 560 m",
      mapId: "sun",
      legs: [
        { time: "05:30", text: <>Depart → Täsch.</> },
        { time: "08:12", text: <>Shuttle to Zermatt. On foot from the Sunnegga valley station, 1 610 m.</> },
        {
          time: "~12:30",
          text: (
            <>
              <b>Blauherd, 2 571 m.</b> The top of a long climb — ~950 m, most of the day’s work.
            </>
          ),
        },
        {
          time: "~13:00",
          text: (
            <>
              <b>Stellisee, 2 537 m.</b> The reflection shot — at lunchtime rather than
              mid-morning, so it needs a calm day.
            </>
          ),
        },
        { time: "~13:15", text: <>Grindjisee below the path — larches, the quiet one.</> },
        { time: "~14:15", text: <>Moosjisee and Leisee, above Sunnegga.</> },
        { time: "~14:45", text: <>Findeln, the hamlet. Then down through the larch forest.</> },
        { time: "~16:15", text: <>Zermatt. Shuttle to Täsch — every 20 min — then 4 min to camp.</> },
        { time: "~17:00", text: <>Camp. Check in before the office shuts at 19:00, tents up, then RandaBoulder at 19:45.</> },
      ],
      note: (
        <>
          <b>Komoot’s 6 h 24 is for one fit hiker</b> — about 7½–8 h for thirteen, which is what
          the times above assume. It is{" "}
          <a href="https://www.komoot.com/smarttour/43215776" target="_blank" rel="noreferrer">
            komoot’s own loop
          </a>{" "}
          from the Sunnegga valley station, all on foot, and it skips Grünsee, the one lake of the
          five that is off this line. <b>The lifts are plan B after Mont Buet:</b> the loop runs
          right past the Blauherd gondola, and Blauherd runs until 4 Oct and Sunnegga until 11 Oct,
          so both are open on the 27th. Ride up and it becomes a half day, at a cost per head for
          thirteen.
        </>
      ),
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
          The Chésérys ladders. Not this time — Saturday is Mont Buet.
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
          <b>Saturday’s route.</b> Out and back from the car park at Le Buet, ten minutes’ drive
          from camp. <b>10–11 h for thirteen.</b>
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
      note: <>Not this time — Sunday is the 5 lakes. From Schwarzsee only; add the Zermatt → Zmutt → Schwarzsee approach for the full day.</>,
    },
    {
      name: "5 Lakes Trail — loop from Zermatt",
      href: "https://www.komoot.com/smarttour/43215776",
      when: "Zermatt · Sun",
      km: "15.1 km",
      ascent: "+970 m",
      time: "6 h 24",
      high: "2 560 m",
      grade: "Hard",
      note: (
        <>
          <b>Sunday’s route.</b> All on foot from the Sunnegga valley station, back down through
          Findeln. Skips Grünsee.
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
      <b>Komoot times are for one fit hiker.</b> Thirteen people regrouping, eating and queueing
      adds 20–30% — that is what turns Mont Buet’s 8 h into 10–11 h. <b>Routes picked on 23
      Sept</b> from the forecast: a dry weekend with the freezing level around 4 000 m. Mont Buet
      takes the clearest, calmest day, and the 5 lakes follow on legs that have just done 1 766 m
      of descent.
    </>
  ),

  pack: [
    {
      title: "Hiking",
      items: [
        { label: "Boots, broken in" },
        { label: "Microspikes, if you own them", sub: "Old hard snow can sit just below the Buet summit" },
        { label: "Trekking poles", sub: "2 740 m of descent in two days" },
        { label: <b>2½–3 L water for Saturday</b>, sub: "The Bérard refuge is likely shut — nothing to refill above 1 924 m" },
        { label: "Headtorch + spares" },
        { label: "Cat-3 sunglasses, SPF 50" },
        { label: "First aid, blisters, tape" },
        { label: "Foil blanket, power bank" },
        { label: "Trail food, both days" },
      ],
    },
    {
      title: "Clothes",
      items: [
        { label: "Hiking socks, merino", sub: "A dry pair each day is the difference between fine and blisters", qty: "4" },
        { label: "Underwear", qty: "4" },
        { label: "Base layers", sub: "One to walk in, one that stays dry for camp", qty: "2" },
        { label: "Fleece or midlayer" },
        {
          label: <b>Insulated jacket</b>,
          sub: "Frost at both sites — a fleece is not enough sitting still at 21:00",
        },
        { label: "Waterproof jacket + overtrousers", sub: "Both, not just the jacket" },
        { label: "Hiking trousers + shorts" },
        { label: "Joggers or warm trousers for camp" },
        { label: "Warm hat + gloves" },
        { label: "Buff or neck gaiter" },
        { label: "A dry set for the drive home", sub: "Nine hours in damp clothes is its own punishment" },
      ],
    },
    {
      title: "Camping",
      items: [
        { label: <b>Bag rated −5 °C</b>, sub: "Frost possible at both sites" },
        { label: "Mat, R-value 3+" },
        { label: "Tent, footprint, stony pegs" },
        { label: "Thermals to sleep in", sub: "Not the ones you walked in" },
        { label: "Camp shoes" },
        { label: "Bin bags, washing-up" },
      ],
    },
    {
      title: "Essentials",
      items: [
        { label: "Toiletries + quick-dry towel" },
        { label: "Shower coins", sub: "Both campsites take them; nobody ever has change" },
        { label: <b>Personal medication</b>, sub: "Tell one other person where you keep it" },
        { label: "Painkillers, antihistamine, plasters" },
        { label: "Lip balm with SPF", sub: "The sun at 2 500 m gets your lips before your face" },
        { label: "Earplugs", sub: "Thirteen of us, two campsites" },
        { label: "Hand sanitiser + wet wipes" },
        { label: "Dry bag or two bin liners", sub: "For wet kit. There will be wet kit." },
        { label: "Spare glasses or lenses" },
      ],
    },
    {
      title: "Boulder",
      items: [
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

  shop: {
    en: {
      lede: (
        <>
          One list, grouped by where you buy it. Whoever is going to that shop picks up
          whatever isn’t ticked yet — no names, no assignments. Keep the receipt, put it into
          the settle-up page, and it evens out at the end.
        </>
      ),
      groups: [
        {
          title: "Asian shop",
          hint: "SAPA, Praha · one trip",
          note: (
            <>
              Everything Korean is here, and so is the soju — <b>there is no reason to drive out
              there twice</b>. Nothing on this list needs a fridge.
            </>
          ),
          items: [
            { label: <b>Instant noodles (mi tom)</b>, sub: "Night three lives on these", qty: "20" },
            { label: "Gochujang", qty: "500 g" },
            { label: "Ssamjang, ready made", qty: "1 tub" },
            { label: "Soy sauce", qty: "1 L" },
            { label: "Sesame oil + sesame seeds", qty: "250 ml" },
            { label: "Mirin, brown sugar, nori" },
            { label: "Kimchi in jars", sub: "Fermented — it keeps without a fridge", qty: "1,5 kg" },
            { label: "Perilla leaves, if they have them", qty: "2 packs" },
            { label: "Soju, mixed flavours", sub: "Not everyone drinks the original", qty: "10 × 360 ml" },
          ],
        },
        {
          title: "Butcher",
          hint: "The day we leave",
          note: (
            <>
              <b>Buy it the day we leave</b> and freeze it solid overnight — it thaws on the drive
              and chills the cool box on the way. Ask for 5 mm slices; you can’t cut bůček that
              thin at camp.
            </>
          ),
          items: [
            { label: "Pork belly, sliced 5 mm", qty: "2,5 kg" },
            { label: "Beef for bulgogi, thin sliced", qty: "1,5 kg" },
            { label: "Boneless chicken thigh", qty: "1,2 kg" },
          ],
        },
        {
          title: "Greengrocer",
          hint: "For the grill plate",
          note: (
            <>
              Everything that goes on the plate beside the meat, plus lettuce for <b>ssam</b> — the
              wrap that makes it Korean rather than just grilled pork. The grilling cheese carries
              the night for anyone off the meat.
            </>
          ),
          items: [
            { label: "Butterhead or gem lettuce", qty: "5 heads" },
            { label: "Mushrooms, king oyster if there are any", qty: "800 g" },
            { label: "Onions", qty: "6" },
            { label: "Courgettes", qty: "3" },
            { label: "Spring onions", qty: "1 bunch" },
            { label: "Garlic", qty: "3 heads" },
            { label: "Carrots", qty: "4" },
            { label: <b>Halloumi-style grilling cheese</b>, qty: "1,5 kg" },
          ],
        },
        {
          title: "Supermarket",
          hint: "Bread, cold cuts, breakfast",
          note: (
            <>
              Rohlíky only for the drive — <b>they do not survive the week</b>, see the notes under
              the list. Breakfast is bread and spreads, which is why there is no milk or cereal here.
            </>
          ),
          items: [
            { label: "Rohlíky", sub: "Drive + first morning only", qty: "20" },
            { label: "Šumava / kmínový chléb", qty: "2 loaves" },
            { label: "Toast bread", qty: "2 packs" },
            { label: "Tortillas", sub: "Best weight-to-calorie ratio in the rucksack", qty: "2 packs" },
            {
              label: <b>Trvanlivý salám</b>,
              sub: "Poličan, Herkules, Vysočina — no fridge needed",
              qty: "1,5 kg",
            },
            { label: "Vacuum-packed šunka", sub: "First two days only", qty: "500 g" },
            { label: "Eidam block + tavený sýr", qty: "1 kg + 10" },
            { label: "Butter, jam, Nutella, Májka" },
            { label: "Ground coffee", sub: "No pot, so it is turek — four or five of us drink it", qty: "250 g" },
            { label: "Tea, black + fruit", qty: "2 boxes" },
          ],
        },
        {
          title: "Drinks",
          hint: "Buy in Czechia",
          note: (
            <>
              All of it is two to three times the price in Switzerland. Water is the first thing
              we run out of and <b>all of it rides in the car</b> — nobody carries it.
            </>
          ),
          items: [
            { label: <b>Bottled water</b>, sub: "Tap water is drinkable at both valleys; this is the car stock", qty: "6 × 6 × 1,5 L" },
            { label: "Red Bull", sub: "About four cans each over four days", qty: "2 × 24" },
            { label: "Beer for somaek", qty: "10 × 0,5 L" },
            { label: "Beer, cider, wine — whatever we’ll actually drink" },
            { label: "Juice, limo, something soft", qty: "12 L" },
            { label: "Something for the summit day", qty: "your call" },
          ],
        },
        {
          title: "Grill & fuel",
          hint: "Supermarket + Decathlon",
          note: (
            <>
              <b>Check which fitting the stove takes</b> before buying gas — screw-on and clip-on
              cartridges are not interchangeable, and supermarkets don’t stock them. Decathlon in
              Sallanches has both if we forget.
            </>
          ),
          items: [
            { label: "Charcoal or gas for the grill", qty: "5–6 kg" },
            { label: "Firelighters + two lighters" },
            { label: "Gas cartridges for the stove", sub: "Never leave one in a hot car", qty: "4 × 230 g" },
            { label: "Foil trays + grill brush" },
            { label: "Aluminium foil", sub: "Potatoes go in the embers on night two" },
          ],
        },
        {
          title: "Table & clean-up",
          hint: "Dull, and the trip stops without it",
          note: (
            <>
              Alpine sites are strict: <b>everything we bring in leaves with us</b>. Get the sturdy
              plates, not the cheapest — a Korean grill beats paper ones in one round.
            </>
          ),
          items: [
            { label: "Cups, plates, cutlery", qty: "for 20" },
            { label: <b>Bottle opener + can opener</b> },
            { label: "Bin bags", qty: "2 rolls" },
            { label: "Kitchen roll + wet wipes" },
            { label: "Washing-up liquid, sponge, tea towel" },
          ],
        },
        {
          title: "Bring, don’t buy",
          hint: "Out of someone’s kitchen",
          note: (
            <>
              None of this needs buying, all of it needs <b>somebody actually remembering it</b>.
              Without the cool box the meat doesn’t survive the drive.
            </>
          ),
          items: [
            { label: "Grill station + flat top for the KBBQ" },
            { label: <b>Cool box + ice packs</b>, sub: "The car fridge only runs while the engine does" },
            { label: "Camping stove" },
            { label: <b>Big pot</b>, sub: "Nothing else we own holds 13 portions", qty: "5 L+" },
            { label: "Second pot + kettle" },
            { label: "Tongs + kitchen scissors", qty: "2 sets" },
            { label: "Sharp knife + board", sub: "KBBQ is non-stop cutting — the most forgotten item here" },
            { label: "Spare headtorch + power bank" },
          ],
        },
      ],
      notes: [
        <>
          <b>The car fridge only runs while the engine does.</b> Fresh meat is night one and nothing
          else. Buy it the day we leave, freeze it solid overnight, and it thaws on the drive while
          chilling everything packed around it. A cool box with ice packs is not optional.
        </>,
        <>
          <b>Rohlík will not make it to the last day.</b> Lean dough with almost no fat: it doesn’t
          go mouldy, it goes hard — tough on day two, a weapon on day three. Twenty for the drive
          and the first morning, then Šumava (4–5 days), toast bread (5–7) and tortillas (weeks).
          Anything stale gets toasted on the grill and is fine.
        </>,
        <>
          <b>Šunka is a day-one-or-two item</b> and lives in the cool box. Trvanlivý salám, tavený
          sýr and Májka need no fridge at all — that is the food that actually goes in the rucksack.
        </>,
        <>
          <b>Nights two and three cook without a fridge.</b> Two: vacuum-packed klobásy and
          foil-wrapped potatoes in the embers, with whatever vegetables survived night one. Three:
          mi tom on the small stove with sliced salám, the last of the kimchi and tavený sýr melted
          over the top — budae jjigae by accident, and precisely what will be left.
        </>,
        <>
          <b>Trail snacks are everyone’s own.</b> Bring what you will actually eat, carry it
          yourself, it is yours. Nobody is buying 13 people’s müsli bars.
        </>,
        <>
          <b>Buy in Czechia, top up in France, buy nothing in Switzerland</b> — Swiss groceries run
          two to three times the price and Zermatt more. French supermarkets shut on Sunday
          afternoon and Swiss ones all day Sunday, so the shop is Saturday.
        </>,
        <>
          <b>Photograph every receipt and put it straight into the settle-up page.</b> Nobody is
          assigned anything, so whoever grabs a shop pays for it that day and it evens out at the
          end — but only if the receipt is entered. Tick alcohol as not shared by Tuty and
          Meloun.
        </>,
      ],
    },

    cs: {
      lede: (
        <>
          Jeden seznam, rozdělený podle toho, kde se co kupuje. Kdo zrovna do toho obchodu jede,
          vezme, co ještě není odškrtnuté — žádná jména, žádné rozdělení. Schovej účtenku, zadej ji
          do vyrovnání a na konci se to srovná.
        </>
      ),
      groups: [
        {
          title: "Asijský obchod",
          hint: "SAPA, Praha · jedna cesta",
          note: (
            <>
              Všechno korejské je tady a soju taky — <b>není důvod tam jet dvakrát</b>. Nic z toho
              nepotřebuje lednici.
            </>
          ),
          items: [
            { label: <b>Instantní nudle (mi tom)</b>, sub: "Třetí večer stojí na nich", qty: "20" },
            { label: "Gochujang", qty: "500 g" },
            { label: "Ssamjang, hotový", qty: "1 kelímek" },
            { label: "Sójová omáčka", qty: "1 L" },
            { label: "Sezamový olej + semínka", qty: "250 ml" },
            { label: "Mirin, hnědý cukr, nori" },
            { label: "Kimchi ve skle", sub: "Fermentované — lednici nepotřebuje", qty: "1,5 kg" },
            { label: "Listy perilla, pokud budou", qty: "2 balení" },
            { label: "Soju, mix příchutí", sub: "Originál nepije každý", qty: "10 × 360 ml" },
          ],
        },
        {
          title: "Řezník",
          hint: "V den odjezdu",
          note: (
            <>
              <b>Kupuje se v den odjezdu</b> a nechá se přes noc zmrznout na kost — cestou rozmrzá a
              do té doby chladí box. Bůček si nech nakrájet na 5 mm, v kempu to tak tenké nenakrájíš.
            </>
          ),
          items: [
            { label: "Bůček, plátky 5 mm", qty: "2,5 kg" },
            { label: "Hovězí na bulgogi, tenké plátky", qty: "1,5 kg" },
            { label: "Kuřecí stehenní maso bez kosti", qty: "1,2 kg" },
          ],
        },
        {
          title: "Zelenina",
          hint: "Na plotnu",
          note: (
            <>
              Všechno, co jde na plotnu vedle masa, plus salát na <b>ssam</b> — zábal, díky kterému
              je to korejské, a ne jen grilované maso. Grilovací sýr zachrání večer každému, kdo
              maso nejí.
            </>
          ),
          items: [
            { label: "Hlávkový nebo máslový salát", qty: "5 hlávek" },
            { label: "Žampiony, ideálně hlíva královská", qty: "800 g" },
            { label: "Cibule", qty: "6" },
            { label: "Cukety", qty: "3" },
            { label: "Jarní cibulka", qty: "1 svazek" },
            { label: "Česnek", qty: "3 palice" },
            { label: "Mrkev", qty: "4" },
            { label: <b>Grilovací sýr</b>, qty: "1,5 kg" },
          ],
        },
        {
          title: "Supermarket",
          hint: "Pečivo, uzeniny, snídaně",
          note: (
            <>
              Rohlíky jen na cestu — <b>týden nevydrží</b>, viz poznámky pod seznamem. Snídaně je
              chleba a pomazánky, proto tu není mléko ani vločky.
            </>
          ),
          items: [
            { label: "Rohlíky", sub: "Jen na cestu a první ráno", qty: "20" },
            { label: "Šumava / kmínový chléb", qty: "2 bochníky" },
            { label: "Toustový chleba", qty: "2 balení" },
            { label: "Tortilly", sub: "Nejlepší poměr váhy a kalorií do batohu", qty: "2 balení" },
            {
              label: <b>Trvanlivý salám</b>,
              sub: "Poličan, Herkules, Vysočina — bez lednice",
              qty: "1,5 kg",
            },
            { label: "Šunka ve vakuu", sub: "Jen první dva dny", qty: "500 g" },
            { label: "Eidam v bloku + tavený sýr", qty: "1 kg + 10" },
            { label: "Máslo, džem, Nutella, Májka" },
            { label: "Mletá káva", sub: "Konvice žádná, takže turek — pije ho pár lidí", qty: "250 g" },
            { label: "Čaj, černý + ovocný", qty: "2 krabičky" },
          ],
        },
        {
          title: "Pití",
          hint: "Kupovat v ČR",
          note: (
            <>
              Ve Švýcarsku je všechno dvakrát až třikrát dražší. Voda dojde jako první a{" "}
              <b>všechna jede v autě</b> — nikdo ji nenese.
            </>
          ),
          items: [
            { label: <b>Balená voda</b>, sub: "Kohoutková je v obou údolích pitná, tohle je zásoba do auta", qty: "6 × 6 × 1,5 L" },
            { label: "Red Bull", sub: "Zhruba čtyři plechovky na osobu na čtyři dny", qty: "2 × 24" },
            { label: "Pivo na somaek", qty: "10 × 0,5 L" },
            { label: "Pivo, cider, víno — co budeme opravdu pít" },
            { label: "Džus, limo, něco nealko", qty: "12 L" },
            { label: "Něco energetického na výstupový den", qty: "dle uvážení" },
          ],
        },
        {
          title: "Gril a palivo",
          hint: "Supermarket + Decathlon",
          note: (
            <>
              <b>Ověř, jakou kartuši vařič bere</b> — šroubovací a klipovací nejsou zaměnitelné a
              v supermarketu je nemají. Decathlon v Sallanches má obojí, kdybychom zapomněli.
            </>
          ),
          items: [
            { label: "Uhlí nebo plyn do grilu", qty: "5–6 kg" },
            { label: "Podpalovač + dva zapalovače" },
            { label: "Kartuše k vařiči", sub: "Nikdy ji nenech v rozpáleném autě", qty: "4 × 230 g" },
            { label: "Hliníkové tácky + kartáč na gril" },
            { label: "Alobal", sub: "Brambory jdou druhý večer do uhlíků" },
          ],
        },
        {
          title: "Nádobí a úklid",
          hint: "Nudné, a bez toho to nejde",
          note: (
            <>
              Alpské kempy jsou přísné: <b>všechno, co přivezeme, odveze se s námi</b>. Talíře ber
              pevné, ne nejlevnější — korejský gril papírové porazí hned v prvním kole.
            </>
          ),
          items: [
            { label: "Kelímky, talíře, příbory", qty: "pro 20" },
            { label: <b>Otvírák na lahve + na konzervy</b> },
            { label: "Pytle na odpad", qty: "2 role" },
            { label: "Papírové utěrky + vlhčené ubrousky" },
            { label: "Jar, houbička, utěrka" },
          ],
        },
        {
          title: "Vzít, ne koupit",
          hint: "Z něčí kuchyně",
          note: (
            <>
              Nic z toho se nekupuje, všechno si to ale <b>musí někdo vzpomenout vzít</b>. Bez
              chladicího boxu maso cestu nepřežije.
            </>
          ),
          items: [
            { label: "Grilovací stanice + plotna na korejský gril" },
            { label: <b>Chladicí box + vložky</b>, sub: "Lednice v autě jede jen za chodu motoru" },
            { label: "Vařič" },
            { label: <b>Velký hrnec</b>, sub: "Nic jiného, co máme, nepojme 13 porcí", qty: "5 L+" },
            { label: "Druhý hrnec + konvice" },
            { label: "Kleště + kuchyňské nůžky", qty: "2 sady" },
            { label: "Ostrý nůž + prkénko", sub: "U korejského grilu se krájí pořád — nejčastěji zapomenutá věc" },
            { label: "Čelovka navíc + powerbanka" },
          ],
        },
      ],
      notes: [
        <>
          <b>Lednice v autě jede jen za chodu motoru.</b> Čerstvé maso je jen na první večer. Kup ho
          v den odjezdu, nech ho přes noc zmrznout na kost — cestou rozmrzá a chladí všechno kolem
          sebe. Chladicí box s vložkami není volitelný.
        </>,
        <>
          <b>Rohlík do posledního dne nevydrží.</b> Libové těsto skoro bez tuku: nezplesniví,
          zkamení — druhý den tvrdý, třetí den zbraň. Dvacet na cestu a první ráno, pak Šumava (4–5
          dní), toustový (5–7) a tortilly (týdny). Co ztvrdne, opeč na grilu a je to dobré.
        </>,
        <>
          <b>Šunka je věc na první dva dny</b> a patří do chladicího boxu. Trvanlivý salám, tavený
          sýr a Májka lednici nepotřebují vůbec — tohle je jídlo, co jde do batohu.
        </>,
        <>
          <b>Druhý a třetí večer se vaří bez lednice.</b> Druhý: vakuované klobásy a brambory
          v alobalu do uhlíků, k tomu zelenina, co zbyla z prvního večera. Třetí: mi tom na malém
          vařiči, nakrájený trvanlivý salám, zbytek kimchi a tavený sýr navrch — nechtěné budae
          jjigae, a přesně to, co zbyde.
        </>,
        <>
          <b>Svačiny na túru si řeší každý sám.</b> Vezmi, co opravdu sníš, nes si to sám, je to
          tvoje. Nikdo nekupuje müsli tyčinky pro čtrnáct lidí.
        </>,
        <>
          <b>Nakupuj v ČR, doplň ve Francii, ve Švýcarsku nekupuj nic</b> — švýcarské potraviny
          stojí dvakrát až třikrát tolik a Zermatt ještě víc. Francouzské supermarkety zavírají
          v neděli odpoledne, švýcarské celou neděli, takže se nakupuje v sobotu.
        </>,
        <>
          <b>Vyfoť každou účtenku a rovnou ji zadej do vyrovnání.</b> Nikdo nemá nic přiřazené,
          takže kdo zrovna vezme nákup, ten ho ten den zaplatí a na konci se to srovná — ale jen
          když je účtenka zadaná. U alkoholu odškrtni, že ho Tuty a Meloun nesdílí.
        </>,
      ],
    },
  },

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
          Email RandaBoulder <span className="fine">— 13 entries, unstaffed hall</span>
        </>
      ),
      when: "Now",
    },
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
