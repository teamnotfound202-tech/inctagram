import {redirect} from 'next/navigation';

export default function RootPage() {
  // Перенаправляем на страницу с локалью по умолчанию
  redirect('/en');
}