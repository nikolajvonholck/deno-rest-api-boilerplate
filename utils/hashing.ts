import { bcrypt } from "../deps.ts";

const { compare, hash } = bcrypt;

export { compare, hash };
