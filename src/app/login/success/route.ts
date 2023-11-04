import { NextRequest, NextResponse } from "next/server"
import { redirect } from 'next/navigation'
import { cookies } from "next/headers";

export async function GET(request: NextRequest,response:NextResponse) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('auth_token') as string;
  cookies().set('token', query)
  // response.cookies.set('token', query)
  redirect('/listing')
  // return Response.redirect('/listing')
}