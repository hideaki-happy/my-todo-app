import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await db.connect();

  try {
    // データベースにテーブルを作成する命令
    await client.sql`
      CREATE TABLE IF NOT EXISTS portfolio_todos (
        id SERIAL PRIMARY KEY,
        user_name TEXT NOT NULL,
        text TEXT NOT NULL,
        deadline TEXT,
        completed BOOLEAN DEFAULT FALSE
      );
    `;
    return NextResponse.json({ message: "テーブルの作成に成功しました！" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "エラーが発生しました", details: error }, { status: 500 });
  } finally {
    client.release();
  }
}