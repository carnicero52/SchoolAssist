import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    name: 'SchoolAssist API', 
    version: '1.0.0',
    status: 'running'
  })
}