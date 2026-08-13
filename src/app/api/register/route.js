import { supabase } from "@/app/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

// aturan validasi
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/; // huruf, angka, underscore, 4-20 karakter
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;        // huruf & spasi saja, 2-50 karakter

function validateInput({ name, username, password }) {
  if (!name || !username || !password) {
    return "Semua field wajib diisi";
  }

  if (typeof name !== "string" || typeof username !== "string" || typeof password !== "string") {
    return "Format data tidak valid";
  }

  const trimmedName = name.trim();
  const trimmedUsername = username.trim();

  if (!NAME_REGEX.test(trimmedName)) {
    return "Nama hanya boleh berisi huruf dan spasi (2-50 karakter)";
  }

  if (!USERNAME_REGEX.test(trimmedUsername)) {
    return "Username hanya boleh huruf, angka, underscore (4-20 karakter)";
  }

  if (password.length < 8 || password.length > 72) {
    return "Password harus 8-72 karakter";
  }

  return null; // valid
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, username, password } = body;

    const validationError = validateInput({ name, username, password });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanName = name.trim();

    const { data: existing } = await supabase
      .from("userlogin")
      .select("id")
      .eq("username", cleanUsername)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Username sudah dipakai" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("userlogin")
      .insert({
        name: cleanName,
        username: cleanUsername,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) throw error;

    // jangan pernah kirim balik password (meski sudah hash) ke response
    const { password: _, ...safeData } = data;

    return NextResponse.json(safeData);
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
