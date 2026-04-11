import asyncHandler from '../utils/async-handler.js';

const healthCheck = asyncHandler((req, res) => {
  res.json({ message: "hello world" });
});


export { healthCheck }
