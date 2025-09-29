const SESSION_STORAGE_KEY = "calmly:last-api-base";

const isBrowser = () => typeof window !== "undefined";

const sanitizeBase = (base) =>
	typeof base === "string" ? base.replace(/\/$/, "") : null;

const getCachedBase = () => {
	if (!isBrowser()) return null;
	try {
		return sanitizeBase(window.sessionStorage.getItem(SESSION_STORAGE_KEY));
	} catch (err) {
		// eslint-disable-next-line no-console
		console.warn("[calmly] Unable to read cached API base", err);
		return null;
	}
};

const rememberBase = (base) => {
	if (!isBrowser()) return;
	const clean = sanitizeBase(base);
	if (!clean) return;
	try {
		window.sessionStorage.setItem(SESSION_STORAGE_KEY, clean);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.warn("[calmly] Unable to cache API base", err);
	}
};

const buildCandidateBases = () => {
	const candidates = [];
	const cached = getCachedBase();
	if (cached) candidates.push(cached);

	const envBase = sanitizeBase(process.env.NEXT_PUBLIC_API_URL);
	if (envBase) candidates.push(envBase);

	if (process.env.NODE_ENV !== "production") {
		[5000, 5001, 5002].forEach((port) => {
			["localhost", "127.0.0.1"].forEach((host) => {
				const url = `http://${host}:${port}`;
				if (!candidates.includes(url)) {
					candidates.push(url);
				}
			});
		});
	}

	return candidates;
};

const shouldRetryWithNextBase = (error) => {
	if (!error) return false;
	// When fetch cannot reach the server it throws a TypeError.
	if (error instanceof TypeError) return true;
	return false;
};

/**
 * Attempt a fetch against the Calmly API with a list of candidate base URLs.
 * Falls back to alternate localhost ports (5001, 5002) when the primary base
 * is unreachable—useful when the backend auto-increments its port in dev.
 *
 * @param {string} path Relative API path, e.g. "/api/mhps/signin"
 * @param {RequestInit} [init] Fetch options
 * @param {string[]} [bases] Optional override list of base URLs to try
 * @returns {Promise<Response>}
 */
export const fetchFromApi = async (path, init = {}, bases) => {
	const candidates = (bases || buildCandidateBases()).filter(Boolean);
	if (!path.startsWith("/")) {
		path = `/${path}`;
	}

	let lastError;
	for (const base of candidates) {
		const url = `${base}${path}`;
		try {
			const response = await fetch(url, init);
			// Remember this base even if the response is a 4xx so we avoid
			// ping-ponging through the fallback list on subsequent calls.
			rememberBase(base);
			return response;
		} catch (error) {
			lastError = error;
			if (!shouldRetryWithNextBase(error)) {
				throw error;
			}
		}
	}

	throw lastError || new Error("Failed to reach Calmly API");
};

export const getDefaultApiBase = () => buildCandidateBases()[0];
