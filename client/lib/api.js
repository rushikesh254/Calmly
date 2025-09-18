import jwtDecode from "jwt-decode";

// This function checks if a token is still valid (not expired).
const checkIfTokenIsStillGood = (token) => {
	try {
		// jwt-decode helps us read the contents of the token.
		const decoded = jwtDecode(token);
		// The token has an expiration time ('exp'). We check if it's in the future.
		return decoded.exp * 1000 > Date.now();
	} catch {
		// If decoding fails, the token is bad.
		return false;
	}
};

// A special fetch function that includes our login token.
export const fetchWithAuth = async (url, options = {}) => {
	// Get the token from where we stored it in the browser.
	const token = localStorage.getItem("accessToken");

	// If there's no token or it's expired, send the user to the login page.
	if (!token || !checkIfTokenIsStillGood(token)) {
		localStorage.removeItem("accessToken");
		window.location.href = "/admin";
		// Stop the function and show an error.
		throw new Error("Your session has expired. Please log in again.");
	}

	// We need to add the token to the request headers.
	const headers = {
		...options.headers,
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`, // This is how the server knows we're logged in.
	};

	// Set a timeout for the request so it doesn't hang forever.
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds

	try {
		// Make the actual request with our special headers.
		const response = await fetch(url, {
			...options,
			headers,
			signal: controller.signal,
		});
		clearTimeout(timeoutId); // Don't forget to clear the timeout!

		// If the server says our token is bad (401), log the user out.
		if (response.status === 401) {
			localStorage.removeItem("accessToken");
			window.location.href = "/admin";
			throw new Error("Your session has expired. Please log in again.");
		}

		// If the response is not 'ok' (like a 404 or 500 error).
		if (!response.ok) {
			const errorInfo = await response.json().catch(() => ({}));
			throw new Error(errorInfo.message || "The request failed.");
		}

		// If everything went well, return the data from the server.
		return response.json();
	} catch (err) {
		clearTimeout(timeoutId);
		// Pass the error along.
		throw err;
	}
};

// A function to check if the logged-in user has the right admin role.
export const checkAdminRole = (requiredRole) => {
	const token = localStorage.getItem("accessToken");
	if (!token) {
		return false;
	}
	try {
		const decoded = jwtDecode(token);
		// Check if the role in the token matches what's required.
		return decoded.role === requiredRole;
	} catch {
		return false;
	}
};

// Keep old names around so other files that import them still work
export const authFetch = fetchWithAuth; // legacy name
export const validateAdminRole = checkAdminRole; // legacy name
