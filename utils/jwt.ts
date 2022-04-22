import { djwt, z } from "../deps.ts";
import { config } from "../services/config.ts";
const { getNumericDate, create, verify } = djwt;
const { TOKEN_SECRET, TOKEN_EXPIRATION_SECONDS } = config;

export type Token = string;

const TokenPayloadSchema = z.object({ sub: z.string() });

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

const keyDerivationIterations = 1000;

const deriveKeyFromSecret = async (secret: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(secret);
  const derivationKey = await crypto.subtle.importKey(
    "raw",
    buffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey", "deriveBits"],
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: { name: "SHA-256" },
      iterations: keyDerivationIterations,
      salt: buffer,
    },
    derivationKey,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"],
  );
};

const key = await deriveKeyFromSecret(TOKEN_SECRET);

export const createToken = async ({ sub }: TokenPayload): Promise<Token> => {
  const header: djwt.Header = { alg: "HS512", typ: "JWT" };
  const exp = getNumericDate(TOKEN_EXPIRATION_SECONDS);
  const payload: djwt.Payload = { sub, exp };
  return await create(header, payload, key);
};

export const verifyToken = async (token: Token): Promise<TokenPayload> => {
  const payload = await verify(token, key);
  return TokenPayloadSchema.parse(payload);
};
