import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { buildBackendUrl } from './helpers/utils';

export const middleware = (request: NextRequest) => {
  const cookieStore = cookies();
  const cookie = cookieStore.get('Set-Cookie');
  const token = cookie?.value;

  const host = process.env.NEXT_PUBLIC_SERVER_FRONTEND || ''
  const port = process.env.LOGIN_FRONTEND_PORT || ''
  const constructedURL = buildBackendUrl({
    host,
    port,
    path: 'login'
  })

  try {
    if (request.nextUrl.pathname == '/') {
      if (token) {
        const url = request.nextUrl.clone();
        url.pathname = '/beneficiaries';
        return NextResponse.redirect(url);
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
    if (request.nextUrl.pathname == '/beneficiaries') {
      if (token) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
    if (request.nextUrl.pathname == '/beneficiary') {
      if (token) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(constructedURL);
      }
    }
  } catch (e) {
    console.log('Error verficando token en middleware');
    return NextResponse.redirect(constructedURL);
  }
};
