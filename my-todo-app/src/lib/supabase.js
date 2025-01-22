// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Supabase URL과 API 키를 환경 변수로 설정합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // .env.local 파일에 추가
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // .env.local 파일에 추가

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
