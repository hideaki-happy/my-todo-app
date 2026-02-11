"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';

// --- ユーザー関連 ---

// 新規ユーザー登録
export async function registerUser(formData: FormData) {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;
  const email = formData.get("email") as string;
  const purpose = formData.get("purpose") as string;

  // パスワードを暗号化
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO portfolio_users (user_id, password, nickname, email, purpose)
      VALUES (${userId}, ${hashedPassword}, ${nickname}, ${email}, ${purpose})
    `;
    return { success: true };
  } catch (error) {
    console.error("登録エラー:", error);
    return { success: false, error: "IDまたはメールアドレスが既に使われています" };
  }
}

// ログイン確認
export async function loginUser(userId: string, password: string) {
  try {
    const { rows } = await sql`SELECT * FROM portfolio_users WHERE user_id = ${userId}`;
    if (rows.length === 0) return { success: false, error: "ユーザーが見つかりません" };

    const user = rows[0];
    // 暗号化されたパスワードと照合
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // ログイン成功時にユーザー情報を返す（本来はセッションを使いますが、今回は簡易版で進めます）
      return { success: true, user: { userId: user.user_id, nickname: user.nickname, purpose: user.purpose } };
    } else {
      return { success: false, error: "パスワードが正しくありません" };
    }
  } catch (error) {
    return { success: false, error: "通信エラーが発生しました" };
  }
}

// --- タスク関連（owner_idを使うように修正） ---

export async function getTodos(ownerId: string) {
  const { rows } = await sql`
    SELECT * FROM portfolio_todos WHERE owner_id = ${ownerId} ORDER BY id DESC
  `;
  return rows;
}

export async function addTodo(ownerId: string, text: string, deadline: string) {
  await sql`
    INSERT INTO portfolio_todos (owner_id, user_name, text, deadline, completed)
    VALUES (${ownerId}, 'temp', ${text}, ${deadline}, false)
  `;
  revalidatePath("/");
}

// ... toggleTodo, deleteTodo は前回のままでOK（idで操作するため） ...
export async function toggleTodo(id: number, completed: boolean) {
  await sql`UPDATE portfolio_todos SET completed = ${completed} WHERE id = ${id}`;
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  await sql`DELETE FROM portfolio_todos WHERE id = ${id}`;
  revalidatePath("/");
}