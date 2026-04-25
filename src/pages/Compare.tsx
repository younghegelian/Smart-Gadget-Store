// src/pages/Compare.tsx
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { Loader2, Award } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type CompareResponse = {
  success: boolean;
  total: number;
  comparison: Array<any>;
};

export default function ComparePage() {
  const { selectedLaptops, addToCompare, removeFromCompare, clearCompare } = useCompare();

  const [localSelected, setLocalSelected] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const triggeredAutoRef = useRef(false);

  // initialize localSelected from context (keeps checkboxes in sync)
  useEffect(() => {
    const map: Record<string, boolean> = {};
    selectedLaptops.forEach((l) => {
      const id = toNameUrl(l);
      if (id) map[id] = true;
    });
    setLocalSelected(map);
  }, [selectedLaptops]);

  // helper to extract name_url (backend expects name_urls array)
  function toNameUrl(l: any) {
    return (
      l.name_url ||
      l.slug ||
      l.id ||
      (l.name ? String(l.name).toLowerCase().replace(/\s+/g, "-") : "")
    );
  }

  // build name_urls from either context or localSelected (prefers context)
  const buildPayloadNames = () => {
    const ids = new Set<string>();
    // prefer context (full objects)
    selectedLaptops.forEach((l) => {
      const n = toNameUrl(l);
      if (n) ids.add(n);
    });
    // fallback to localSelected if context empty
    if (ids.size === 0) {
      Object.entries(localSelected).forEach(([k, v]) => v && ids.add(k));
    }
    return Array.from(ids);
  };

  // call compare API
  const callCompareApi = async (name_urls: string[]) => {
    if (name_urls.length < 2) {
      alert("Select at least 2 laptops to compare.");
      return;
    }

    setLoading(true);
    setFailed(false);
    setResult(null);

    const timeout = setTimeout(() => {
      setLoading(false);
      setFailed(true);
      alert("Comparison request timed out (20s).");
    }, 20000);

    try {
      const res = await axiosInstance.post("/compare/compare-laptop", { name_urls });
      clearTimeout(timeout);
      setLoading(false);
      if (res.data?.success && Array.isArray(res.data.comparison)) {
        // sort by score desc for overall ranking
        const sorted = [...res.data.comparison].sort((a: any, b: any) => (b.score ?? 0) - (a.score ?? 0));
        setResult({ ...res.data, comparison: sorted });
        console.log("Compare response:", res.data);
      } else {
        setFailed(true);
        alert("Unexpected response from compare API.");
      }
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      setFailed(true);
      console.error("Compare API error", err);
      alert("Compare API failed. Check console for details.");
    }
  };

  // auto-trigger when user navigates to /compare and there are selected laptops in context
  useEffect(() => {
    const payload = buildPayloadNames();
    if (!triggeredAutoRef.current && payload.length >= 2) {
      triggeredAutoRef.current = true;
      callCompareApi(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLaptops]);

  // checkbox toggle (local UI)
  const toggleLocal = (id: string, laptopObj?: any) => {
    setLocalSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // sync to context: if selected, add; if unselected remove
      if (!prev[id]) {
        // add to context if laptopObj provided
        if (laptopObj) addToCompare(laptopObj);
      } else {
        removeFromCompare(id);
      }
      return next;
    });
  };

  const onManualCompareClick = () => {
    const payload = buildPayloadNames();
    callCompareApi(payload);
  };

  // ---------- Helpers ----------
  function safeNumber(val: any): number | null {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return val;
    const s = String(val).replace(/[^\d.-]/g, "");
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function buildRanks(items: any[], accessor: (it: any) => number | null) {
    const vals = items.map((it) => ({ it, v: accessor(it) }));
    const sorted = [...vals].sort((a, b) => {
      if (a.v === null && b.v === null) return 0;
      if (a.v === null) return 1;
      if (b.v === null) return -1;
      return (b.v as number) - (a.v as number);
    });
    const ranks = new Map<any, number>();
    let rank = 0;
    let prevVal: number | null = null;
    for (const entry of sorted) {
      if (entry.v !== prevVal) {
        rank += 1;
        prevVal = entry.v;
      }
      const id = entry.it.name_url || entry.it.name || entry.it.slug;
      ranks.set(id, rank);
    }
    return { ranks, sortedVals: sorted };
  }

  const displayValue = (it: any, key: string) => {
    if (!it?.specs && key !== "score" && key !== "price") return "N/A";
    if (key === "score") return typeof it.score === "number" ? it.score.toFixed(4) : "N/A";
    if (key === "price") {
      const pd = it.price_details;
      if (!pd) return "N/A";
      if (pd.roundedPrice) return pd.roundedPrice;
      if (pd.priceValue) return `₹ ${Number(pd.priceValue).toLocaleString("en-IN")}`;
      return "N/A";
    }
    const v = it.specs?.[key];
    if (v === null || v === undefined) return "N/A";
    return String(v);
  };

  // features to compare (order / labels / accessor)
  const FEATURES: { key: string; label: string; accessor: (it: any) => number | null }[] = [
    { key: "score", label: "Overall Score", accessor: (it) => safeNumber(it.score) },
    { key: "cpu_clock_speed", label: "CPU Clock (GHz)", accessor: (it) => safeNumber(it.specs?.cpu_clock_speed ?? it.specs?.cpu ?? null) },
    { key: "gpu_vram", label: "GPU VRAM (GB)", accessor: (it) => safeNumber(it.specs?.gpu_vram ?? null) },
    { key: "ram", label: "RAM (GB)", accessor: (it) => safeNumber(it.specs?.ram ?? null) },
    { key: "internal_storage", label: "Storage (GB)", accessor: (it) => safeNumber(it.specs?.internal_storage ?? null) },
    { key: "resolutionPixels", label: "Resolution (pixels)", accessor: (it) => safeNumber(it.specs?.resolutionPixels ?? null) },
    { key: "price", label: "Price (lower better)", accessor: (it) => {
        // backend priceValue (lower = better) -> invert to rank higher = better
        const pv = it.price_details?.priceValue ?? null;
        return pv != null ? -Number(pv) : null;
      }
    }
  ];

  // ---------- Render ----------
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Compare Laptops</h1>
            <p className="text-muted-foreground">Backend ranks laptops — feature-wise comparison shown below. Best laptop appears at top.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { clearCompare(); setLocalSelected({}); setResult(null); }}>Clear All</Button>
          </div>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Selected laptops are taken from the floating compare button (or tick checkboxes below). Click Compare to request ranking from backend.
            </div>
            <div>
              <Button
                onClick={onManualCompareClick}
                disabled={loading || (buildPayloadNames().length < 2)}
                className="bg-green-600 text-white"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Compare Now"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading / Failed */}
        {loading && (
          <Card className="p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-3" size={28} />
            <div className="font-medium">Comparing... fetching ranking from backend</div>
            <div className="text-muted-foreground mt-2">This may take up to 20s.</div>
          </Card>
        )}

        {failed && (
          <Card className="p-6 text-center text-red-500">Comparison failed or timed out. Try again.</Card>
        )}

        {/* If result is present show the best laptop detail + feature-wise comparisons */}
        {result && !loading && (
          <div className="space-y-8">

            {/* Top result — rich card */}
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-yellow-500" /> Best Pick</h2>

              <Card className="p-6 mt-3">
                {result.comparison.length > 0 ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-72 flex items-center justify-center">
                      <img
                        src={result.comparison[0].price_details?.image ?? ""}
                        alt={result.comparison[0].name}
                        className="w-full h-56 object-cover rounded shadow"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-semibold">{result.comparison[0].name}</h3>
                          <div className="text-sm text-muted-foreground mt-1">{result.comparison[0].name_url}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-green-600 font-bold text-lg">Score: {(result.comparison[0].score ?? 0).toFixed(4)}</div>
                          <div className="text-muted-foreground mt-1">{result.comparison[0].price_details?.roundedPrice ?? "N/A"}</div>
                        </div>
                      </div>

                      {/* small spec chips */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge>{result.comparison[0].specs?.ram ? `${result.comparison[0].specs.ram} GB RAM` : "RAM N/A"}</Badge>
                        <Badge>{result.comparison[0].specs?.internal_storage ? `${result.comparison[0].specs.internal_storage} GB SSD` : "Storage N/A"}</Badge>
                        <Badge>{result.comparison[0].specs?.gpu_vram ? `${result.comparison[0].specs.gpu_vram} GB GPU` : "GPU N/A"}</Badge>
                        <Badge>{result.comparison[0].specs?.resolution ?? "Resolution N/A"}</Badge>
                      </div>

                      {/* actions */}
                      <div className="mt-6 flex gap-3">
                        <a href={result.comparison[0].price_details?.url ?? "#"} target="_blank" rel="noreferrer">
                          <Button className="bg-blue-600 text-white">Buy / Browse</Button>
                        </a>

                        <Link to={`/laptop/${result.comparison[0].name_url}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>

                        <Button variant="ghost" onClick={() => console.log("Top laptop raw:", result.comparison[0])}>Log Raw</Button>
                      </div>

                      {/* description area (auto-filled from price_details.name if any) */}
                      <div className="mt-4 text-sm text-muted-foreground">
                        {result.comparison[0].price_details?.name ?? ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>No comparison data returned.</div>
                )}
              </Card>
            </div>

            {/* Feature-wise comparison blocks */}
            <div>
              <h3 className="text-xl font-bold mb-3">Feature-wise Comparison</h3>

              {/* each feature builds ranks and shows a row */}
              <div className="space-y-6">
                {FEATURES.map((f) => {
                  const items = result.comparison;
                  // compute ranks and sorted values
                  const { ranks, sortedVals } = buildRanks(items, f.accessor);
                  // compute max absolute value for bar scaling
                  const numericVals = sortedVals.map((s) => s.v).filter((v) => v !== null) as number[];
                  const maxVal = numericVals.length ? Math.max(...numericVals.map(Math.abs)) : 0;

                  return (
                    <Card key={f.key} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">{f.label}</div>
                        <div className="text-sm text-muted-foreground">Rank shown as #1 = best</div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/40">
                              <th className="p-3 text-left">Laptop</th>
                              <th className="p-3 text-left">Value</th>
                              <th className="p-3 text-left">Rank</th>
                              <th className="p-3 text-left">Visual</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((it: any) => {
                              const id = it.name_url || it.name || it.slug;
                              const rank = ranks.get(id) ?? "-";
                              const raw = f.accessor(it);
                              const barPct = raw === null || maxVal === 0 ? 0 : Math.min(100, Math.round((Math.abs(raw as number) / maxVal) * 100));
                              const best = rank === 1;
                              const shownValue = displayValue(it, f.key);
                              return (
                                <tr key={id} className="border-b hover:bg-muted/30">
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      <img src={it.price_details?.image ?? ""} alt={it.name} className="w-20 h-14 object-cover rounded"/>
                                      <div>
                                        <div className="font-medium">{it.name}</div>
                                        <div className="text-xs text-muted-foreground">{it.name_url}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">{shownValue}</td>
                                  <td className="p-3"><Badge className={best ? "bg-amber-400 text-black" : ""}>#{rank}</Badge></td>
                                  <td className="p-3 w-1/3">
                                    <div className="bg-muted/20 rounded h-3 w-full overflow-hidden">
                                      <div style={{ width: `${barPct}%` }} className="h-3 rounded bg-gradient-to-r from-primary to-secondary"></div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Full ranking table */}
            <div>
              <h3 className="text-xl font-bold mb-3">Full Ranking</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="p-4">Rank</th>
                      <th className="p-4">Laptop</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Key specs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparison.map((c, i) => (
                      <tr key={c.name_url || i} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-semibold">{i + 1}</td>
                        <td className="p-4">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.name_url}</div>
                        </td>
                        <td className="p-4 font-semibold">{(c.score ?? 0).toFixed(4)}</td>
                        <td className="p-4">{c.price_details?.roundedPrice ?? "N/A"}</td>
                        <td className="p-4 text-sm">
                          CPU: {c.specs?.cpu_clock_speed ?? c.specs?.cpu ?? "N/A"} •
                          GPU VRAM: {c.specs?.gpu_vram ?? "N/A"} GB •
                          RAM: {c.specs?.ram ?? "N/A"} GB •
                          Storage: {c.specs?.internal_storage ?? "N/A"} GB
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <Button variant="outline" onClick={() => console.log("Full compare result:", result)}>Log full response</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
