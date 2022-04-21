import { DataTypes, Model, z } from "../deps.ts";

export class User extends Model {
  static table = "users";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  };
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  passwordHash: z.string(),
});

export const IdSchema = z.object({ id: z.string().uuid() });

export const UserSchemaCreate = UserSchema.omit({
  id: true,
  passwordHash: true,
}).extend({ password: z.string() });
export const UserSchemaUpdate = UserSchemaCreate.partial();

export type UserDTO = z.infer<typeof UserSchema>;
export type UserDTOCreate = z.infer<typeof UserSchemaCreate>;
export type UserDTOUpdate = z.infer<typeof UserSchemaUpdate>;
