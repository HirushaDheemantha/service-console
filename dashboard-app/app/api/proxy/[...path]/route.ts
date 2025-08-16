// dashboard-app/app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Disable caching

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params);
}

// Add other methods as needed (PUT, PATCH, DELETE)

async function handleProxyRequest(
  request: NextRequest,
  params: { path: string[] }
) {
  const path = params.path.join('/');
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  
  try {
    const headers = new Headers(request.headers);
    headers.delete('host'); // Remove host header
    
    const apiRes = await fetch(apiUrl, {
      method: request.method,
      headers,
      body: request.body,
      cache: 'no-store'
    });

    if (!apiRes.ok) {
      const error = await apiRes.text();
      return NextResponse.json(
        { error: `Backend error: ${error}` },
        { status: apiRes.status }
      );
    }

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}