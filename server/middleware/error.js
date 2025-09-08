// Central error handler. Logs in non-test environments and returns JSON payload.
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	if (process.env.NODE_ENV !== 'test') {
		console.error(
			`[Error] ${req.method} ${req.originalUrl} -> ${statusCode}:`,
			err.stack || err.message
		);
	}
	res.status(statusCode).json({
		success: false,
		error: err.message,
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
};
