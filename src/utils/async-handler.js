// const asyncHandler = () => {}
// const asyncHandler = (function_X) => {}
// const asyncHandler = (function_X) => async (function_X) => {}
// async handler is function that take another function and pass it to another async function, which wraps the input function_X and adds error handling

let asyncHandler = (requestHandler) => {
  (request, response, next) => {
    Promise.resolve(requestHandler(request, response, next)).catch((error) =>
      next(error)
    );
  };
};

asyncHandler = (fun) => async (request, response, next) => {
  try {
    await fun(request, response, next);
  } catch (error) {
    response
      .status(error.code ?? 500)
      .json({ success: false, message: error.message });
  }
};

export default asyncHandler;
