// frontend/app/api/query/routes.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'http://127.0.0.1:8000'; // Your FastAPI backend

export async function GET(request: NextRequest) {
  try {
    // Example: call backend root endpoint
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Backend fetch failed' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

