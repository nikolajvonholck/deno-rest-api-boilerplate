import { DataTypes, Model, z } from "../deps.ts";

export class Todo extends Model {
  static table = "todos";
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    isCompleted: { type: DataTypes.BOOLEAN, allowNull: false },
  };

  static defaults = {
    isCompleted: false,
  };
}

export const TodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  isCompleted: z.boolean(),
});

export const IdSchema = z.object({ id: z.string().uuid() });

export const TodoSchemaCreate = TodoSchema.omit({ id: true }).partial({
  isCompleted: true,
});
export const TodoSchemaUpdate = TodoSchema.omit({ id: true }).partial();

export type TodoDTOCreate = z.infer<typeof TodoSchemaCreate>;
export type TodoDTOUpdate = z.infer<typeof TodoSchemaUpdate>;
