const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const message = `${field} already exists. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
 console.error('ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateKeyError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'CastError') error = handleCastError(error);

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;