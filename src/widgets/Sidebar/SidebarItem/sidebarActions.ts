// sidebarActions.ts
import { TypeOfModalWindow } from '@/widgets/Sidebar/Sidebar'

type SidebarAction =
  | { type: 'button'; actionType: TypeOfModalWindow }
  | { type: 'link' }

export const sidebarActions: Record<string, SidebarAction> = {
  'Log Out': { type: 'button', actionType: 'Logout' },
  'Create': { type: 'button', actionType: 'AddPhotoModal' },
  // добавишь новые кнопки сюда, когда понадобится
}