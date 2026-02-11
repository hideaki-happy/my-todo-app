"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

// タスクを取得する
export async function getTodos(userName: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM portfolio_todos 
      WHERE user_name = ${userName} 
      ORDER BY id DESC
    `;
    return rows;
  } catch (error) {
    console.error("取得エラー:", error);
    return [];
  }
}

// タスクを追加する
export async function addTodo(userName: string, text: string, deadline: string) {
  await sql`
    INSERT INTO portfolio_todos (user_name, text, deadline, completed)
    VALUES (${userName}, ${text}, ${deadline}, false)
  `;
  revalidatePath("/");
}

// 完了状態を切り替える
export async function toggleTodo(id: number, completed: boolean) {
  await sql`
    UPDATE portfolio_todos 
    SET completed = ${completed} 
    WHERE id = ${id}
  `;
  revalidatePath("/");
}

// タスクを削除する
export async function deleteTodo(id: number) {
  await sql`
    DELETE FROM portfolio_todos WHERE id = ${id}
  `;
  revalidatePath("/");
}