export const DEFAULT_GLOBE_SETTINGS = {
    showGlobe: true,
    autoRotate: true,
    showClouds: true,
    showAtmosphere: true,
    showGeographicLines: true,
    showContinentOutlines: true,
};

const STORAGE_KEY = 'globeSettings';
const SETTINGS_EVENT = 'globeSettingsChanged';

export const getGlobeSettings = () => {
    if (typeof window === 'undefined') return DEFAULT_GLOBE_SETTINGS;

    try {
        const savedSettings = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        return { ...DEFAULT_GLOBE_SETTINGS, ...savedSettings };
    } catch {
        return DEFAULT_GLOBE_SETTINGS;
    }
};

export const saveGlobeSettings = (settings) => {
    const nextSettings = { ...DEFAULT_GLOBE_SETTINGS, ...settings };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: nextSettings }));
    return nextSettings;
};

export const subscribeToGlobeSettings = (onChange) => {
    const handleStorageChange = (event) => {
        if (event.key === STORAGE_KEY) onChange(getGlobeSettings());
    };
    const handleSettingsChange = (event) => onChange(event.detail);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SETTINGS_EVENT, handleSettingsChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(SETTINGS_EVENT, handleSettingsChange);
    };
};
