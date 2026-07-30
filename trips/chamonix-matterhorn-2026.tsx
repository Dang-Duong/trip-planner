import type { LngLat, Trip } from "@/lib/types";

// Trail geometry for the hike options, drawn on the map on hover. Routed once on the
// public BRouter server (free, no key) and pasted in, then simplified to ~12 m.
// To regenerate a route:
//   curl "https://brouter.de/brouter?lonlats=<lon,lat>|<lon,lat>&profile=hiking-beta&format=geojson"
// one leg at a time — its watchdog kills long multi-leg requests.

const lacblancTrail: LngLat[] = [
  [6.92918, 45.99561], [6.92814, 45.99614], [6.92792, 45.99648], [6.92678, 45.99665],
  [6.92641, 45.99696], [6.92612, 45.99635], [6.92643, 45.99575], [6.92593, 45.9949],
  [6.92542, 45.99457], [6.92498, 45.99451], [6.92457, 45.99468], [6.9241, 45.99427],
  [6.92346, 45.99408], [6.92275, 45.99338], [6.92233, 45.99244], [6.92138, 45.99196],
  [6.92148, 45.99158], [6.92072, 45.9909], [6.92082, 45.99058], [6.92034, 45.98965],
  [6.91865, 45.98827], [6.91821, 45.98767], [6.91722, 45.98782], [6.91721, 45.98834],
  [6.91649, 45.98833], [6.91587, 45.98772], [6.91458, 45.98699], [6.91374, 45.98588],
  [6.91367, 45.98599], [6.91307, 45.98569], [6.912, 45.98482], [6.91181, 45.98432],
  [6.91067, 45.9839], [6.90993, 45.98324], [6.90897, 45.98275], [6.90866, 45.98294],
  [6.90856, 45.98233], [6.90818, 45.98254], [6.90798, 45.9824], [6.9076, 45.98255],
  [6.90728, 45.98241], [6.9072, 45.98257], [6.90687, 45.9824], [6.90663, 45.98251],
  [6.9055, 45.98235], [6.90501, 45.98295], [6.90452, 45.98313], [6.90454, 45.98336],
  [6.90427, 45.98341], [6.9032, 45.98292], [6.90234, 45.98278], [6.90037, 45.98263],
  [6.89991, 45.98275], [6.89984, 45.98296], [6.89876, 45.9829], [6.89825, 45.98259],
  [6.89773, 45.98189], [6.89695, 45.98161], [6.8964, 45.98168], [6.8958, 45.98212],
  [6.89442, 45.98218], [6.89343, 45.98197], [6.89363, 45.98169], [6.89284, 45.98123],
  [6.8926, 45.98146], [6.89238, 45.98134], [6.89224, 45.98151], [6.89188, 45.98145],
  [6.89103, 45.98192], [6.89093, 45.98232], [6.89064, 45.98249], [6.89077, 45.98266],
  [6.89047, 45.98288], [6.89086, 45.98356], [6.89112, 45.98369], [6.89065, 45.98338],
  [6.89047, 45.98288], [6.89077, 45.98266], [6.89064, 45.98249], [6.89093, 45.98232],
  [6.89103, 45.98192], [6.8915, 45.98166], [6.89158, 45.98128], [6.89124, 45.98065],
  [6.89128, 45.98007], [6.89091, 45.98], [6.89162, 45.97977], [6.8914, 45.97966],
  [6.89155, 45.97869], [6.89204, 45.97821], [6.89198, 45.97797], [6.89263, 45.97788],
  [6.89244, 45.9775], [6.89268, 45.97751], [6.89271, 45.97677], [6.89316, 45.97619],
  [6.89293, 45.9753], [6.89337, 45.97459], [6.89301, 45.97384], [6.89322, 45.97382],
  [6.89198, 45.97186], [6.89149, 45.97178], [6.89062, 45.97122], [6.88927, 45.96979],
  [6.88816, 45.96982], [6.88746, 45.96932], [6.88742, 45.96834], [6.88715, 45.96805],
  [6.88728, 45.96764], [6.88687, 45.9668], [6.88734, 45.96567], [6.88648, 45.96523],
  [6.88571, 45.96418], [6.88781, 45.96404], [6.88688, 45.96285], [6.88701, 45.96234],
  [6.88744, 45.96199], [6.88777, 45.96225], [6.88779, 45.96283], [6.88938, 45.96359],
  [6.88975, 45.96397], [6.89339, 45.96442], [6.89703, 45.96632], [6.89737, 45.96623],
  [6.89738, 45.96553], [6.89766, 45.96559], [6.8977, 45.96545], [6.89821, 45.96587],
  [6.89844, 45.9657], [6.90036, 45.96643], [6.90038, 45.96626], [6.9013, 45.96644],
  [6.90132, 45.96615], [6.90167, 45.96643], [6.90199, 45.9661], [6.90211, 45.96642],
  [6.90238, 45.96647], [6.90278, 45.96614], [6.90283, 45.96667], [6.90304, 45.96668],
  [6.9033, 45.96636], [6.90482, 45.96719], [6.90489, 45.96693], [6.90544, 45.96719],
  [6.90547, 45.96707], [6.90607, 45.96726], [6.90659, 45.96722], [6.90768, 45.96829],
  [6.90817, 45.96807], [6.90883, 45.96849], [6.90872, 45.96808], [6.90895, 45.9676],
  [6.90979, 45.96842], [6.90999, 45.9692], [6.91052, 45.9696], [6.91193, 45.96952],
  [6.91174, 45.96932], [6.9123, 45.96908], [6.91263, 45.96915], [6.91336, 45.96982],
  [6.91418, 45.97189], [6.91558, 45.97329], [6.91732, 45.97434], [6.9198, 45.97508],
  [6.92074, 45.97601], [6.92187, 45.97556], [6.9222, 45.97518], [6.92302, 45.9748],
  [6.92419, 45.97478],
];

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

const hornlihutteTrail: LngLat[] = [
  [7.74939, 46.02115], [7.7491, 46.02069], [7.74856, 46.02062], [7.74668, 46.01964],
  [7.74617, 46.01971], [7.74596, 46.01929], [7.74551, 46.01917], [7.74502, 46.01781],
  [7.74126, 46.01507], [7.73995, 46.01378], [7.7397, 46.01294], [7.73879, 46.01213],
  [7.73801, 46.01196], [7.73715, 46.01142], [7.7357, 46.01102], [7.73439, 46.01007],
  [7.73302, 46.00953], [7.7315, 46.00974], [7.73125, 46.00938], [7.73031, 46.00874],
  [7.7296, 46.00856], [7.72929, 46.00812], [7.72784, 46.00717], [7.72645, 46.00682],
  [7.72527, 46.00604], [7.72401, 46.00558], [7.72289, 46.00547], [7.72232, 46.00561],
  [7.72312, 46.00567], [7.72271, 46.00627], [7.7222, 46.00647], [7.7207, 46.00632],
  [7.71972, 46.00671], [7.71779, 46.00682], [7.71584, 46.00626], [7.71435, 46.00657],
  [7.71404, 46.00634], [7.71352, 46.00641], [7.71418, 46.00547], [7.71384, 46.00512],
  [7.71409, 46.00484], [7.71201, 46.00521], [7.71136, 46.00559], [7.71033, 46.00572],
  [7.70758, 46.00583], [7.70441, 46.00622], [7.70227, 46.00616], [7.70156, 46.00665],
  [7.69951, 46.00637], [7.69932, 46.00597], [7.70065, 46.00512], [7.69877, 46.00491],
  [7.70058, 46.00414], [7.70038, 46.00416], [7.6998, 46.00365], [7.69982, 46.00266],
  [7.70029, 46.00251], [7.70179, 46.00254], [7.70206, 46.00238], [7.70179, 46.00233],
  [7.70167, 46.00195], [7.69893, 46.0012], [7.69655, 46.0003], [7.69784, 45.99899],
  [7.69902, 45.99829], [7.69911, 45.99783], [7.69875, 45.99728], [7.70281, 45.9962],
  [7.70379, 45.99578], [7.70338, 45.99429], [7.70396, 45.99367], [7.70533, 45.99352],
  [7.70571, 45.99321], [7.70633, 45.99216], [7.70621, 45.99098], [7.70642, 45.99072],
  [7.70628, 45.99119], [7.70543, 45.99174], [7.70543, 45.99153], [7.70521, 45.99156],
  [7.70484, 45.99118], [7.70438, 45.99121], [7.70378, 45.99053], [7.70403, 45.99046],
  [7.70359, 45.9901], [7.70375, 45.98999], [7.70359, 45.98965], [7.70295, 45.98916],
  [7.70205, 45.98923], [7.70168, 45.98908], [7.70183, 45.98925], [7.70164, 45.99005],
  [7.70122, 45.98966], [7.70098, 45.9901], [7.7009, 45.98978], [7.70046, 45.99001],
  [7.70032, 45.98946], [7.69813, 45.98967], [7.6969, 45.98933], [7.69503, 45.98838],
  [7.69424, 45.98824], [7.69281, 45.98817], [7.69381, 45.98836], [7.69257, 45.98873],
  [7.69282, 45.98851], [7.69041, 45.98844], [7.68869, 45.98789], [7.68745, 45.98706],
  [7.68532, 45.98632], [7.68374, 45.98454], [7.68283, 45.98462], [7.68236, 45.98436],
  [7.68276, 45.98434], [7.68235, 45.98415], [7.68239, 45.9838], [7.68191, 45.98379],
  [7.68203, 45.98368], [7.68032, 45.98305], [7.6798, 45.98304], [7.68006, 45.98293],
  [7.67951, 45.98285], [7.67954, 45.98241], [7.6793, 45.98233], [7.67928, 45.9825],
  [7.67894, 45.98225], [7.67891, 45.98253], [7.67847, 45.98226], [7.67851, 45.98253],
  [7.67773, 45.98208], [7.67764, 45.98234], [7.67712, 45.98213],
];

const fuenfseenTrail: LngLat[] = [
  [7.78735, 46.01681], [7.78738, 46.0165], [7.78841, 46.01594], [7.79272, 46.01467],
  [7.79516, 46.01368], [7.79658, 46.01371], [7.79848, 46.01323], [7.79958, 46.01375],
  [7.80028, 46.01375], [7.79916, 46.01358], [7.79867, 46.01325], [7.7989, 46.01294],
  [7.79834, 46.01294], [7.79706, 46.01339], [7.79634, 46.01337], [7.79695, 46.01306],
  [7.79694, 46.01262], [7.79773, 46.01253], [7.80018, 46.01154], [7.80085, 46.01089],
  [7.79947, 46.01017], [7.79931, 46.00968], [7.7989, 46.00948], [7.79774, 46.00963],
  [7.79465, 46.01051], [7.79473, 46.01074], [7.7931, 46.01137], [7.79226, 46.01132],
  [7.79206, 46.01157], [7.79013, 46.01184], [7.79072, 46.01143], [7.79038, 46.01112],
  [7.79057, 46.01088], [7.79355, 46.00957], [7.7939, 46.00912], [7.79306, 46.00863],
  [7.79221, 46.00772], [7.79141, 46.00744], [7.79148, 46.00713], [7.79115, 46.00686],
  [7.79137, 46.00677], [7.78984, 46.00688], [7.78686, 46.00557], [7.78582, 46.00588],
  [7.7852, 46.00581], [7.78449, 46.00599], [7.78439, 46.00654], [7.78409, 46.00668],
  [7.78163, 46.00657], [7.78084, 46.00693], [7.78126, 46.00771], [7.78323, 46.00835],
  [7.78358, 46.0087], [7.78456, 46.009], [7.78379, 46.00919], [7.78394, 46.00931],
  [7.78344, 46.00934], [7.78364, 46.00953], [7.78325, 46.00957], [7.78426, 46.01],
  [7.78482, 46.00991], [7.78488, 46.01024], [7.78334, 46.01069], [7.77949, 46.01098],
  [7.77877, 46.01029], [7.77602, 46.01168], [7.77565, 46.01199], [7.7755, 46.01275],
  [7.77505, 46.01327], [7.77352, 46.01422], [7.77333, 46.01481], [7.7729, 46.01517],
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
      at: [6.9242, 45.9748],
      kind: "camp",
      note: "camp 1 · Fri, Sat",
      labelSide: "below",
    },
    { id: "trelechamp", name: "Tré-le-Champ", at: [6.9292, 45.9956], kind: "stop", note: "1 417 m · ladders" },
    { id: "coldesmontets", name: "Col des Montets", at: [6.9236, 46.0039], kind: "stop", note: "overflow parking" },
    { id: "lacblanc", name: "Lac Blanc", at: [6.8911, 45.9837], kind: "goal", note: "2 352 m · Sat high point" },
    { id: "montblanc", name: "Mont Blanc", at: [6.865, 45.833], kind: "peak", note: "4 806 m" },
    // Mont Buet alternative — up the Bérard valley. Coordinates from OSM.
    { id: "lebuet", name: "Le Buet", at: [6.9204, 46.0192], kind: "start", note: "1 330 m · by train" },
    { id: "cascadeberard", name: "Cascade de Bérard", at: [6.9118, 46.02], kind: "stop", labelSide: "below" },
    { id: "refugeberard", name: "Refuge de la Pierre à Bérard", at: [6.8687, 46.003], kind: "hut", note: "1 924 m · shut by late Sept" },
    { id: "montbuet", name: "Mont Buet", at: [6.8525, 46.0248], kind: "goal", note: "3 096 m · turn back by 13:00" },
    { id: "tasch", name: "Täsch", at: [7.777, 46.0677], kind: "stop", note: "terminal · CHF 16/car" },
    { id: "randa", name: "Randa", at: [7.7823, 46.0857], kind: "camp", note: "camp 2 · Sun", labelSide: "above" },
    { id: "zermatt", name: "Zermatt", at: [7.7493, 46.0212], kind: "stop", note: "1 620 m · on foot 07:30" },
    { id: "zmutt", name: "Zmutt", at: [7.7171, 46.0065], kind: "stop", note: "1 936 m · ~09:00" },
    { id: "schwarzsee", name: "Schwarzsee", at: [7.7068, 45.9908], kind: "stop", note: "2 583 m · turn back 13:00" },
    { id: "hornlihutte", name: "Hörnlihütte", at: [7.677, 45.9822], kind: "hut", note: "3 260 m · Sun high point" },
    { id: "matterhorn", name: "Matterhorn", at: [7.6586, 45.9766], kind: "peak", note: "4 478 m" },
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
          line: lacblancTrail,
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
          line: montbuetTrail,
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
          line: hornlihutteTrail,
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
          line: fuenfseenTrail,
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
