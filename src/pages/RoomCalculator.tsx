import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calculator, ChevronRight, Lightbulb, Ruler, Check, ShoppingBag } from "lucide-react";

interface RoomSize {
  width: number;
  length: number;
  unit: "ft" | "m";
}

interface CarpetRecommendation {
  size: string;
  coverage: string;
  description: string;
  suitability: "perfect" | "good" | "acceptable";
  dimensionsFt: [number, number];
}

const ROOM_PRESETS = [
  { label: "Small Bedroom", width: 10, length: 10 },
  { label: "Master Bedroom", width: 12, length: 14 },
  { label: "Living Room (Small)", width: 12, length: 15 },
  { label: "Living Room (Large)", width: 15, length: 20 },
  { label: "Dining Room", width: 10, length: 12 },
  { label: "Study / Office", width: 10, length: 10 },
  { label: "Kids Room", width: 9, length: 10 },
  { label: "Hallway", width: 4, length: 10 },
];

const ROOM_TYPES = [
  { value: "living", label: "Living Room", tip: "Carpet should be large enough to anchor all furniture, with front legs resting on it." },
  { value: "bedroom", label: "Bedroom", tip: "Extend 18–24 inches on each exposed side of the bed for a luxurious feel." },
  { value: "dining", label: "Dining Room", tip: "Allow 24 inches beyond each side of the table so chairs remain on the carpet when pulled out." },
  { value: "hallway", label: "Hallway / Runner", tip: "Leave 3–4 inches of flooring on each side. Length should span 2/3 to 3/4 of the hall." },
  { value: "office", label: "Office / Study", tip: "Cover the area under the desk and chair. Consider a hard-surface protector mat on top." },
];

function getRecommendations(width: number, length: number): CarpetRecommendation[] {
  // Convert to ft if needed (already handled upstream)
  const area = width * length;
  const recs: CarpetRecommendation[] = [];

  // 2x3
  if (area <= 30) recs.push({ size: "2x3 ft", coverage: "6 sq ft", description: "Accent mat — ideal for small corners, doorways", suitability: "perfect", dimensionsFt: [2, 3] });
  // 3x5
  if (area >= 10 && area <= 60) recs.push({ size: "3x5 ft", coverage: "15 sq ft", description: "Small area rug, great for reading nooks", suitability: area <= 30 ? "good" : "perfect", dimensionsFt: [3, 5] });
  // 4x6
  if (area >= 15 && area <= 80) recs.push({ size: "4x6 ft", coverage: "24 sq ft", description: "Compact room anchor, small bedroom side piece", suitability: area <= 50 ? "perfect" : "good", dimensionsFt: [4, 6] });
  // 5x7
  if (area >= 30 && area <= 120) recs.push({ size: "5x7 ft", coverage: "35 sq ft", description: "Versatile mid-size — small living rooms, bedrooms", suitability: area >= 40 && area <= 90 ? "perfect" : "good", dimensionsFt: [5, 7] });
  // 6x8
  if (area >= 60 && area <= 180) recs.push({ size: "6x8 ft", coverage: "48 sq ft", description: "Popular choice for medium rooms and bedrooms", suitability: area >= 70 && area <= 140 ? "perfect" : "good", dimensionsFt: [6, 8] });
  // 6x9
  if (area >= 70 && area <= 200) recs.push({ size: "6x9 ft", coverage: "54 sq ft", description: "Great for medium bedrooms and living rooms", suitability: area >= 80 && area <= 160 ? "perfect" : "good", dimensionsFt: [6, 9] });
  // 8x10
  if (area >= 100 && area <= 280) recs.push({ size: "8x10 ft", coverage: "80 sq ft", description: "Standard for living rooms, can anchor large sectionals", suitability: area >= 120 && area <= 220 ? "perfect" : "good", dimensionsFt: [8, 10] });
  // 9x12
  if (area >= 140 && area <= 380) recs.push({ size: "9x12 ft", coverage: "108 sq ft", description: "Large room statement piece, formal living/dining rooms", suitability: area >= 160 && area <= 300 ? "perfect" : "good", dimensionsFt: [9, 12] });
  // 10x14
  if (area >= 200) recs.push({ size: "10x14 ft", coverage: "140 sq ft", description: "Grand size for spacious living rooms and dining areas", suitability: area >= 220 ? "perfect" : "acceptable", dimensionsFt: [10, 14] });

  // Sort: perfect first, then good, then acceptable
  const order = { perfect: 0, good: 1, acceptable: 2 };
  recs.sort((a, b) => order[a.suitability] - order[b.suitability]);
  return recs.slice(0, 5);
}

const SUITABILITY_CONFIG = {
  perfect: { label: "Perfect Fit", color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800", dot: "bg-green-500" },
  good: { label: "Good Match", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  acceptable: { label: "Acceptable", color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
};

export const RoomCalculator = () => {
  const [room, setRoom] = useState<RoomSize>({ width: 12, length: 15, unit: "ft" });
  const [roomType, setRoomType] = useState("living");
  const [selected, setSelected] = useState<CarpetRecommendation | null>(null);
  const [calculated, setCalculated] = useState(false);

  // Convert to ft for calculations
  const widthFt = room.unit === "m" ? room.width * 3.281 : room.width;
  const lengthFt = room.unit === "m" ? room.length * 3.281 : room.length;

  const recommendations = useMemo(() => {
    if (!calculated) return [];
    return getRecommendations(widthFt, lengthFt);
  }, [widthFt, lengthFt, calculated]);

  const selectedRoomType = ROOM_TYPES.find(r => r.value === roomType);

  const handleCalculate = () => {
    setCalculated(true);
    setSelected(null);
  };

  const handlePreset = (preset: typeof ROOM_PRESETS[0]) => {
    setRoom({ width: preset.width, length: preset.length, unit: "ft" });
    setCalculated(false);
  };

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div
        className="relative min-h-[30vh] flex items-center justify-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1400&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 text-center text-white px-4 py-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calculator className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-medium uppercase tracking-wider text-sm">Smart Tool</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Room Size Calculator</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Enter your room dimensions and we'll suggest the perfect carpet size and filter the shop for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Calculator Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Room Type */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" /> Room Details
              </h2>

              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Room Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {ROOM_TYPES.map(rt => (
                    <button
                      key={rt.value}
                      onClick={() => setRoomType(rt.value)}
                      className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${
                        roomType === rt.value
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedRoomType && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex gap-2 text-xs text-blue-700 dark:text-blue-300 mb-4">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                  {selectedRoomType.tip}
                </div>
              )}

              {/* Unit toggle */}
              <div className="flex mb-4 border border-border rounded-xl overflow-hidden">
                {(["ft", "m"] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => {
                      if (room.unit === u) return;
                      const factor = u === "m" ? 0.3048 : 3.281;
                      setRoom(r => ({
                        ...r,
                        unit: u,
                        width: parseFloat((r.width * factor).toFixed(1)),
                        length: parseFloat((r.length * factor).toFixed(1)),
                      }));
                      setCalculated(false);
                    }}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      room.unit === u ? "bg-primary text-white" : "hover:bg-muted"
                    }`}
                  >
                    {u === "ft" ? "Feet (ft)" : "Metres (m)"}
                  </button>
                ))}
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Width ({room.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={room.unit === "ft" ? 100 : 30}
                    step="0.5"
                    value={room.width}
                    onChange={e => { setRoom(r => ({ ...r, width: parseFloat(e.target.value) || 1 })); setCalculated(false); }}
                    className="input-field text-center font-semibold text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Length ({room.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={room.unit === "ft" ? 100 : 30}
                    step="0.5"
                    value={room.length}
                    onChange={e => { setRoom(r => ({ ...r, length: parseFloat(e.target.value) || 1 })); setCalculated(false); }}
                    className="input-field text-center font-semibold text-lg"
                  />
                </div>
              </div>

              <div className="text-sm text-center text-muted-foreground mb-4 bg-muted rounded-xl py-2">
                Area: <strong>{(room.width * room.length).toFixed(1)} {room.unit}²</strong>
                {room.unit === "m" && <> = <strong>{(widthFt * lengthFt).toFixed(0)} ft²</strong></>}
              </div>

              <button onClick={handleCalculate} className="btn-primary w-full text-base py-3">
                <Calculator className="w-5 h-5" /> Find Best Carpet Size
              </button>
            </div>

            {/* Presets */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-heading font-semibold mb-3 text-sm">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p)}
                    className="text-left px-3 py-2.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-xs"
                  >
                    <p className="font-medium text-foreground">{p.label}</p>
                    <p className="text-muted-foreground">{p.width}×{p.length} ft</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {!calculated ? (
              <div className="bg-card border border-border rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Ready to Calculate</h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your room dimensions on the left and click "Find Best Carpet Size" to get personalized recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold">
                    Carpet Size Recommendations
                  </h2>
                  <span className="badge bg-primary/10 text-primary">
                    {recommendations.length} options
                  </span>
                </div>

                {/* Room Visualizer */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3">Room Visualizer</h3>
                  <div className="relative bg-amber-50 dark:bg-amber-900/10 rounded-xl overflow-hidden" style={{ paddingTop: `${Math.min(60, (lengthFt / widthFt) * 40)}%` }}>
                    {/* Room boundary */}
                    <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-lg">
                      {/* Carpet overlay */}
                      {selected && (
                        <div
                          className="absolute bg-primary/30 border-2 border-primary rounded transition-all duration-300"
                          style={{
                            left: "10%",
                            top: "10%",
                            width: `${Math.min(80, (selected.dimensionsFt[0] / widthFt) * 80)}%`,
                            height: `${Math.min(80, (selected.dimensionsFt[1] / lengthFt) * 80)}%`,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary bg-white/80 dark:bg-black/60 px-1.5 py-0.5 rounded">
                              {selected.size}
                            </span>
                          </div>
                        </div>
                      )}
                      <span className="absolute bottom-1 right-2 text-[10px] text-amber-600 font-medium">
                        Room: {room.width}×{room.length} {room.unit}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {selected ? `${selected.size} carpet shown in room` : "Select a size below to visualize"}
                  </p>
                </div>

                {/* Recommendation cards */}
                <div className="space-y-3">
                  {recommendations.map((rec, i) => {
                    const cfg = SUITABILITY_CONFIG[rec.suitability];
                    const isSelected = selected?.size === rec.size;
                    return (
                      <div
                        key={rec.size}
                        onClick={() => setSelected(rec)}
                        className={`bg-card border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                          isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl font-heading font-bold text-lg flex items-center justify-center shrink-0 ${
                            i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-heading font-bold text-lg">{rec.size}</h3>
                              <span className={`badge text-xs border ${cfg.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block mr-1`} />
                                {cfg.label}
                              </span>
                              {i === 0 && <span className="badge bg-amber-100 text-amber-700 text-xs">Top Pick</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                            <p className="text-xs text-muted-foreground">Coverage: {rec.coverage}</p>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-primary shrink-0 mt-1" />}
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Link
                              to={`/shop?size=${encodeURIComponent(rec.size)}`}
                              className="btn-primary w-full justify-center text-sm py-2.5"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Shop {rec.size} Carpets
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {selected && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                    <h4 className="font-semibold text-sm mb-1">Pro Tip for {roomType === "living" ? "Living Rooms" : roomType === "bedroom" ? "Bedrooms" : roomType === "dining" ? "Dining Rooms" : "This Room Type"}</h4>
                    <p className="text-xs text-muted-foreground">{selectedRoomType?.tip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 bg-card border border-border rounded-2xl p-8">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">Carpet Sizing Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Living Room",
                tips: [
                  "All legs on carpet: 8×10 ft or larger",
                  "Front legs only: 6×9 ft works great",
                  "Floating arrangement: 4×6 ft minimum",
                  "Keep 12–18 inches from walls",
                ],
              },
              {
                title: "Bedroom",
                tips: [
                  "King bed: 9×12 ft (extends 18\" each side)",
                  "Queen bed: 8×10 ft or 6×9 ft",
                  "Twin bed: 5×7 ft or 4×6 ft",
                  "Runner on each side: 2.5×8 ft",
                ],
              },
              {
                title: "Dining Room",
                tips: [
                  "Add 24\" around table for chairs",
                  "6-seat table: 8×10 ft minimum",
                  "8-seat table: 9×12 ft recommended",
                  "Round table: circular rug matches well",
                ],
              },
            ].map(({ title, tips }) => (
              <div key={title}>
                <h3 className="font-heading font-semibold mb-3">{title}</h3>
                <ul className="space-y-1.5">
                  {tips.map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
