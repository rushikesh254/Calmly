import { ZodError } from 'zod';

// Create a validation middleware for the given schema and request section (body, query, params).
export const validate = (schema, source = 'body') => (req, res, next) => {
	try {
		const parsed = schema.parse(req[source]);
		req[source] = parsed; // Replace with sanitized data
		next();
	} catch (err) {
		if (err instanceof ZodError) {
			return res.status(400).json({
				success: false,
				error: 'Validation failed',
				details: err.errors,
			});
		}
		next(err);
	}
};
