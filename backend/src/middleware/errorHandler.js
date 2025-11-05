export const notFoundHandler = (_req, res, _next) => {
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Unexpected error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
