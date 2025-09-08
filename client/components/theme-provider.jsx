"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Context stores current theme and toggle handler. Undefined default helps detect misuse.
const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState("light");

	// Initialize from localStorage on first mount (client-side only) and set HTML class.
	useEffect(() => {
		const saved = localStorage.getItem("theme") || "light";
		setTheme(saved);
		document.documentElement.classList.toggle("dark", saved === "dark");
	}, []);

	const toggleTheme = () => {
		const next = theme === "light" ? "dark" : "light";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.classList.toggle("dark", next === "dark");
	};

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (ctx === undefined) throw new Error("useTheme must be used within a ThemeProvider");
	return ctx;
}
