const successResponse = (message, data, statusCode = 200) => {
    return {
      status: 'success',
      message,
      data,
      statusCode
    };
  };
  
  const errorResponse = (message, statusCode = 500, error = null) => {
    return {
      status: 'error',
      message,
      statusCode,
      error: error ? error.toString() : null
    };
  };
  
  module.exports = {
    successResponse,
    errorResponse
  };