import React, { useState } from 'react';
import { Calculator, Fish } from 'lucide-react';

export default function FishToTankCalculator() {
  const [tankLength, setTankLength] = useState('');
  const [tankWidth, setTankWidth] = useState('');
  const [tankDepth, setTankDepth] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const l = parseFloat(tankLength);
    const w = parseFloat(tankWidth);
    const d = parseFloat(tankDepth);
    if (!l || !w || !d || l <= 0 || w <= 0 || d <= 0) return;

    // Volume in cubic meters
    const volumeM3 = (l * w * d) / 1000; // inputs in cm → m³
    // Recommended stocking density for hito: ~50-100 fish per cubic meter
    const minFish = Math.round(volumeM3 * 50);
    const maxFish = Math.round(volumeM3 * 100);
    const recommended = Math.round(volumeM3 * 75);

    setResult({ volumeM3: volumeM3.toFixed(2), minFish, maxFish, recommended });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30">
          <Calculator className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fish-to-Tank Calculator</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Estimate how many hito fingerlings your tank can support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Length (cm)</label>
          <input
            type="number"
            value={tankLength}
            onChange={e => setTankLength(e.target.value)}
            placeholder="e.g. 200"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Width (cm)</label>
          <input
            type="number"
            value={tankWidth}
            onChange={e => setTankWidth(e.target.value)}
            placeholder="e.g. 100"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Depth (cm)</label>
          <input
            type="number"
            value={tankDepth}
            onChange={e => setTankDepth(e.target.value)}
            placeholder="e.g. 80"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2"
      >
        <Fish className="w-5 h-5" /> Calculate Stocking Capacity
      </button>

      {result && (
        <div className="mt-6 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 animate-[fadeIn_0.5s_ease-out]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400">{result.volumeM3}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tank Volume (m³)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{result.minFish}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Conservative</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400">{result.recommended}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recommended</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{result.maxFish}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Maximum</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Based on 50–100 hito fingerlings per m³. Adjust based on filtration and aeration capacity.
          </p>
        </div>
      )}
    </div>
  );
}