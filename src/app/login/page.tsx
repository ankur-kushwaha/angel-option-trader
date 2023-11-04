import { SMART_API_KEY } from '@/constants/config';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function LoginRedirectPage() {
  const cookieStore = cookies()
  const theme = cookieStore.get('token');
  
  if(theme){
    redirect('/listing')
  }else{
    redirect('https://smartapi.angelbroking.com/publisher-login?api_key='+SMART_API_KEY)
  }
}
