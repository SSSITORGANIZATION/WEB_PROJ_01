import React, { useEffect, useState } from 'react';
import { Check, Globe2, RotateCcw } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Globe from '../../components/Globe/Globe';
import {
    DEFAULT_GLOBE_SETTINGS,
    getGlobeSettings,
    saveGlobeSettings,
    subscribeToGlobeSettings,
} from '../../utils/globeSettings';

const settingsFields = [
    { key: 'showGlobe', label: 'Show globe' },
    { key: 'autoRotate', label: 'Auto rotate' },
    { key: 'showClouds', label: 'Clouds' },
    { key: 'showAtmosphere', label: 'Atmosphere' },
    { key: 'showGeographicLines', label: 'Latitude and longitude lines' },
    { key: 'showContinentOutlines', label: 'Continent outlines' },
];

const AdminGlobeSettings = () => {
    const [globeSettings, setGlobeSettings] = useState(getGlobeSettings);

    useEffect(() => subscribeToGlobeSettings(setGlobeSettings), []);

    const updateSetting = (key, value) => {
        const nextSettings = { ...globeSettings, [key]: value };
        setGlobeSettings(nextSettings);
        saveGlobeSettings(nextSettings);
    };

    const resetSettings = () => {
        setGlobeSettings(DEFAULT_GLOBE_SETTINGS);
        saveGlobeSettings(DEFAULT_GLOBE_SETTINGS);
    };

    return (
        <div className="flex min-h-screen bg-slate-950">
            <AdminSidebar />

            <main className="relative min-h-screen flex-1 overflow-hidden bg-[#07111f]">
                <div className="absolute inset-0">
                    {globeSettings.showGlobe ? (
                        <Globe {...globeSettings} />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                            Globe hidden
                        </div>
                    )}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/75 via-transparent to-slate-950/20" />

                <div className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-10">
                    <header className="max-w-xl">
                        <div className="mb-4 flex items-center gap-3 text-blue-300">
                            <Globe2 className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em]">Visual Systems</span>
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                            Globe Settings
                        </h1>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                            Configure the globe shown on the public home page. Changes are applied immediately.
                        </p>
                    </header>

                    <div className="pointer-events-auto w-full max-w-sm self-end rounded-2xl border border-white/15 bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Display controls</h2>
                                <p className="mt-1 text-xs text-slate-400">Public globe configuration</p>
                            </div>
                            <button
                                type="button"
                                onClick={resetSettings}
                                title="Reset globe settings"
                                aria-label="Reset globe settings"
                                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            {settingsFields.map(({ key, label }) => (
                                <label
                                    key={key}
                                    className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 text-sm text-slate-200 transition-colors hover:bg-white/5"
                                >
                                    <span>{label}</span>
                                    <input
                                        type="checkbox"
                                        checked={globeSettings[key]}
                                        onChange={(event) => updateSetting(key, event.target.checked)}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-emerald-300">
                            <Check className="h-4 w-4" />
                            Settings sync automatically
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminGlobeSettings;
