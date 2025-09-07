import jwtDecode from "jwt-decode";

// True if token decodes and isn't expired yet.
const isTokenValid = (token) => {
	try {
		const decoded = jwtDecode(token);
		return decoded.exp * 1000 > Date.now();
	} catch {
		return false;
	}
};

// Authenticated fetch with timeout + automatic redirect on auth failure.
export const authFetch = async (url, options = {}) => {
	const token = localStorage.getItem("accessToken");

	if (!token || !isTokenValid(token)) {
		localStorage.removeItem("accessToken");
		window.location.href = "/admin";
		throw new Error("Session expired. Please login again.");
	}

	const headers = {
		...options.headers,
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`
	};

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000);

	try {
		const response = await fetch(url, { ...options, headers, signal: controller.signal });
		clearTimeout(timeoutId);

		if (response.status === 401) {
			localStorage.removeItem("accessToken");
			window.location.href = "/admin";
			throw new Error("Session expired. Please login again.");
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || "Request failed");
		}

		return response.json();
	} catch (err) {
		clearTimeout(timeoutId);
		throw err;
	}
};

export const validateAdminRole = (requiredRole) => {
	const token = localStorage.getItem("accessToken");
	if (!token) return false;
	try {
		const decoded = jwtDecode(token);
		return decoded.role === requiredRole;
	} catch {
		return false;
	}
};
