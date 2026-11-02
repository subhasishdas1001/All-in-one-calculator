import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { formatNum, roundNum } from '../../utils/mathEngine';
import {
  CalculatorActionBar,
  HowWasThisCalculated,
} from '../CalculatorActionToolbar';
import { ToolId } from '../../types/calculator';

export type UnitCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed'
  | 'data';

interface UnitDef {
  id: string;
  label: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (base: number) => number;
}

const UNIT_DEFINITIONS: Record<UnitCategory, { title: string; units: UnitDef[] }> = {
  length: {
    title: 'Length & Distance',
    units: [
      { id: 'mm', label: 'Millimeter (mm)', symbol: 'mm', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'cm', label: 'Centimeter (cm)', symbol: 'cm', toBase: (v) => v * 0.01, fromBase: (b) => b / 0.01 },
      { id: 'm', label: 'Meter (m)', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
      { id: 'km', label: 'Kilometer (km)', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'in', label: 'Inch (in)', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
      { id: 'ft', label: 'Foot (ft)', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
      { id: 'yd', label: 'Yard (yd)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
      { id: 'mi', label: 'Mile (mi)', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
    ],
  },
  weight: {
    title: 'Weight & Mass',
    units: [
      { id: 'mg', label: 'Milligram (mg)', symbol: 'mg', toBase: (v) => v * 0.000001, fromBase: (b) => b / 0.000001 },
      { id: 'g', label: 'Gram (g)', symbol: 'g', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'kg', label: 'Kilogram (kg)', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
      { id: 'ton', label: 'Metric Tonne (t)', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'oz', label: 'Ounce (oz)', symbol: 'oz', toBase: (v) => v * 0.0283495231, fromBase: (b) => b / 0.0283495231 },
      { id: 'lb', label: 'Pound (lb)', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
      { id: 'st', label: 'Stone (st)', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (b) => b / 6.35029318 },
    ],
  },
  temperature: {
    title: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius (°C)', symbol: '°C', toBase: (v) => v, fromBase: (b) => b },
      { id: 'f', label: 'Fahrenheit (°F)', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (b) => (b * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin (K)', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (b) => b + 273.15 },
      { id: 'r', label: 'Rankine (°R)', symbol: '°R', toBase: (v) => ((v - 491.67) * 5) / 9, fromBase: (b) => ((b + 273.15) * 9) / 5 },
    ],
  },
  area: {
    title: 'Area',
    units: [
      { id: 'sqcm', label: 'Square Centimeter (cm²)', symbol: 'cm²', toBase: (v) => v * 0.0001, fromBase: (b) => b / 0.0001 },
      { id: 'sqm', label: 'Square Meter (m²)', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
      { id: 'sqkm', label: 'Square Kilometer (km²)', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
      { id: 'sqft', label: 'Square Foot (ft²)', symbol: 'ft²', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304 },
      { id: 'acre', label: 'Acre (ac)', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224 },
      { id: 'ha', label: 'Hectare (ha)', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
    ],
  },
  volume: {
    title: 'Volume',
    units: [
      { id: 'ml', label: 'Milliliter (mL)', symbol: 'mL', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 'l', label: 'Liter (L)', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
      { id: 'cum', label: 'Cubic Meter (m³)', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
      { id: 'gal', label: 'US Gallon (gal)', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784 },
      { id: 'cup', label: 'US Cup (cup)', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (b) => b / 0.2365882365 },
      { id: 'floz', label: 'US Fluid Ounce (fl oz)', symbol: 'fl oz', toBase: (v) => v * 0.0295735296, fromBase: (b) => b / 0.0295735296 },
    ],
  },
  time: {
    title: 'Time',
    units: [
      { id: 'ms', label: 'Millisecond (ms)', symbol: 'ms', toBase: (v) => v * 0.001, fromBase: (b) => b / 0.001 },
      { id: 's', label: 'Second (s)', symbol: 's', toBase: (v) => v, fromBase: (b) => b },
      { id: 'min', label: 'Minute (min)', symbol: 'min', toBase: (v) => v * 60, fromBase: (b) => b / 60 },
      { id: 'hr', label: 'Hour (hr)', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
      { id: 'day', label: 'Day (d)', symbol: 'd', toBase: (v) => v * 86400, fromBase: (b) => b / 86400 },
      { id: 'wk', label: 'Week (wk)', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (b) => b / 604800 },
    ],
  },
  speed: {
    title: 'Speed & Velocity',
    units: [
      { id: 'mps', label: 'Meters per second (m/s)', symbol: 'm/s', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kmh', label: 'Kilometers per hour (km/h)', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (b) => b * 3.6 },
      { id: 'mph', label: 'Miles per hour (mph)', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (b) => b / 0.44704 },
      { id: 'kn', label: 'Knot (kn)', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (b) => b / 0.514444 },
    ],
  },
  data: {
    title: 'Digital Data Storage',
    units: [
      { id: 'b', label: 'Byte (B)', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
      { id: 'kb', label: 'Kilobyte (KB)', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
      { id: 'mb', label: 'Megabyte (MB)', symbol: 'MB', toBase: (v) => v * Math.pow(1024, 2), fromBase: (b) => b / Math.pow(1024, 2) },
      { id: 'gb', label: 'Gigabyte (GB)', symbol: 'GB', toBase: (v) => v * Math.pow(1024, 3), fromBase: (b) => b / Math.pow(1024, 3) },
      { id: 'tb', label: 'Terabyte (TB)', symbol: 'TB', toBase: (v) => v * Math.pow(1024, 4), fromBase: (b) => b / Math.pow(1024, 4) },
    ],
  },
};

interface ConverterProps {
  initialCategory?: UnitCategory;
  lockedCategory?: boolean;
  toolId: ToolId;
  onLogHistory: (toolId: ToolId, toolName: string, inputs: string, result: string) => void;
}

export const UnitConverterSuite: React.FC<ConverterProps> = ({
  initialCategory = 'length',
  lockedCategory = false,
  toolId,
  onLogHistory,
}) => {
  const [category, setCategory] = useState<UnitCategory>(initialCategory);
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>(
    UNIT_DEFINITIONS[initialCategory].units[2]?.id || UNIT_DEFINITIONS[initialCategory].units[0].id
  );
  const [toUnitId, setToUnitId] = useState<string>(
    UNIT_DEFINITIONS[initialCategory].units[5]?.id || UNIT_DEFINITIONS[initialCategory].units[1].id
  );

  useEffect(() => {
    setCategory(initialCategory);
    const units = UNIT_DEFINITIONS[initialCategory].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1]?.id || units[0].id);
  }, [initialCategory]);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = UNIT_DEFINITIONS[cat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1]?.id || units[0].id);
  };

  const unitsList = UNIT_DEFINITIONS[category].units;
  const fromUnit = unitsList.find((u) => u.id === fromUnitId) || unitsList[0];
  const toUnit = unitsList.find((u) => u.id === toUnitId) || unitsList[1] || unitsList[0];

  const numericIn = Number(inputValue);
  const isValid = Number.isFinite(numericIn) && inputValue.trim() !== '';
  const baseVal = isValid ? fromUnit.toBase(numericIn) : 0;
  const convertedVal = isValid ? roundNum(toUnit.fromBase(baseVal), 6) : 0;

  const handleSwap = () => {
    setFromUnitId(toUnit.id);
    setToUnitId(fromUnit.id);
  };

  const summaryText = isValid
    ? `${inputValue} ${fromUnit.symbol} = ${formatNum(convertedVal, 6)} ${toUnit.symbol}`
    : '';

  const handleLogCalculation = () => {
    if (!isValid) return;
    onLogHistory(
      toolId,
      `${UNIT_DEFINITIONS[category].title} Converter`,
      `${inputValue} ${fromUnit.label} to ${toUnit.label}`,
      summaryText
    );
  };

  return (
    <div className="space-y-6">
      {!lockedCategory && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(UNIT_DEFINITIONS) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border active:scale-[0.98] ${
                category === cat
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {UNIT_DEFINITIONS[cat].title}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Convert {UNIT_DEFINITIONS[category].title}
          </h2>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Value to Convert
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                From Unit
              </label>
              <select
                value={fromUnit.id}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base font-medium"
              >
                {unitsList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap units"
                className="h-12 w-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                To Unit
              </label>
              <select
                value={toUnit.id}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-base font-medium"
              >
                {unitsList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CalculatorActionBar
            calculateLabel="Convert Units"
            onCalculate={handleLogCalculation}
            onReset={() => setInputValue('1')}
            resultText={summaryText}
          />
        </div>

        {/* Result Card + All Units Comparison Table */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            Conversion Result
          </h2>

          <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800">
            <div className="text-xs sm:text-sm text-slate-400">
              {isValid ? `${inputValue} ${fromUnit.label} equals` : 'Enter a value'}
            </div>
            <div className="text-4xl font-extrabold font-mono tabular-nums text-sky-400 mt-2">
              {isValid ? `${formatNum(convertedVal, 6)} ${toUnit.symbol}` : '—'}
            </div>
          </div>

          {isValid && (
            <HowWasThisCalculated
              steps={[
                {
                  label: 'Input Value',
                  expression: `${inputValue} ${fromUnit.symbol}`,
                },
                {
                  label: 'Converted Result',
                  expression: `${formatNum(convertedVal, 6)} ${toUnit.symbol}`,
                  highlight: true,
                },
              ]}
            />
          )}

          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              All {UNIT_DEFINITIONS[category].title} Equivalents
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {unitsList.map((u) => {
                const val = isValid ? roundNum(u.fromBase(baseVal), 6) : 0;
                return (
                  <div key={u.id} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{u.label}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                      {isValid ? formatNum(val, 6) : '0'} {u.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
