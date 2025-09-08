import { ZodError } from "zod";

// Returns middleware that validates a request segment (body/query/params) with a Zod schema.
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed; // Replace raw input with sanitized data
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: err.errors,
        });
      }
      next(err);
    }
  };
