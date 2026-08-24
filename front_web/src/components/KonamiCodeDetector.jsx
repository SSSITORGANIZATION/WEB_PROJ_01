import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const KonamiCodeDetector = () => {
    const navigate = useNavigate();
    const patternRef = useRef([]);
    const timerRef = useRef(null);

    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const KONAMI_CODE = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'KeyB',
        'KeyA'
    ];

    const resetPattern = useCallback(() => {
        patternRef.current = [];
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const checkPattern = useCallback(() => {
        const currentPattern = patternRef.current;

        // Check if the last N keys match the Konami code
        if (currentPattern.length >= KONAMI_CODE.length) {
            const lastKeys = currentPattern.slice(-KONAMI_CODE.length);
            const isMatch = lastKeys.every((key, index) => key === KONAMI_CODE[index]);

            if (isMatch) {
                resetPattern();
                navigate('/admin-login');
                return true;
            }
        }
        return false;
    }, [navigate, resetPattern]);

    const handleKeyDown = useCallback((e) => {
        // Ignore if user is typing in an input, textarea, or contenteditable element
        const target = e.target;
        const isInputField =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable ||
            target.getAttribute('contenteditable') === 'true';

        if (isInputField) {
            return;
        }

        // Get the key code (e.code is more reliable than e.key for special keys)
        const keyCode = e.code;

        // Add key to pattern
        patternRef.current.push(keyCode);

        // Clear existing timer and start new one
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Reset pattern after 5 seconds of inactivity
        timerRef.current = setTimeout(() => {
            resetPattern();
        }, 5000);

        // Check if pattern matches
        checkPattern();

        // Keep pattern length manageable (max 20 keys)
        if (patternRef.current.length > 20) {
            patternRef.current = patternRef.current.slice(-20);
        }
    }, [checkPattern, resetPattern]);

    useEffect(() => {
        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            resetPattern();
        };
    }, [handleKeyDown, resetPattern]);

    return null;
};

export default KonamiCodeDetector;
