import { djwt, z } from "../deps.ts";
// import { config } from "../services/config.ts";

export type Token = string;

const { getNumericDate, create, verify } = djwt;

const TokenPayloadSchema = z.object({ sub: z.string() });

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

// TODO: Load key from env.
// const key = config.TOKEN_SECRET;
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const header: djwt.Header = { alg: "HS512", typ: "JWT" };

// TODO: use env var
const expiryInSeconds = 60;

export const createToken = async ({ sub }: TokenPayload): Promise<Token> => {
  const exp = getNumericDate(expiryInSeconds);
  const payload: djwt.Payload = { sub, exp };
  return await create(header, payload, key);
};

export const verifyToken = async (token: Token): Promise<TokenPayload> => {
  const payload = await verify(token, key);
  return TokenPayloadSchema.parse(payload);
};
