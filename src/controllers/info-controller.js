import asyncHandler from '../utils/async-handler.js';

const healthCheck = asyncHandler((request, response) => {
  res.json({ message: "hello world" });
});


export { healthCheck }
