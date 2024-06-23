// simple function to simulate validate token funtionality.
// If token value was pass to the function, it will return true, otherwise false
const validate = (token: any) => {
  const validToken = true;

  if (!validToken || !token) {
    return false;
  }
  return true;
};

// this function is going to import in the main middleware.ts file
// we can pass Bearel Token in the req header. (in authorization property)
// in this function we check such kind of token was pass or not
export function authMiddleware(req: Request): any {
  const token = req.headers.get("authorization")?.split(" ")[1];

  return { isValid: validate(token) };
}
