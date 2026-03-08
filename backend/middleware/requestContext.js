import { randomUUID } from "crypto";

export const requestContext = (req, res, next) => {
  const incomingRequestId = req.headers["x-request-id"];
  req.id = typeof incomingRequestId === "string" && incomingRequestId.trim()
    ? incomingRequestId.trim()
    : randomUUID();

  res.setHeader("x-request-id", req.id);
  next();
};
