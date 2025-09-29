export type Text =
  | 'Feed'
  | 'Create'
  | 'My Profile'
  | 'Messenger'
  | 'Search'
  | 'Statistics'
  | 'Favorites'
  | 'Log Out'
export type SideBarData = {
  key: string
  text: Text
  link: string
  isDisabled: boolean
  onclick?: boolean
  textForLink: {
    en:string
    ru:string
  }
}
export const sideBarData: SideBarData[] = [
    {
    key: 'Feed',
    text: 'Feed',
    link: '',
    isDisabled: false,
      textForLink:{
      en:'Feed',
        ru:'Лента'
      }
  },
  {
    key: 'Create',
    text: 'Create',
    link: '',
    isDisabled: false,
    textForLink:{
      en:'Create',
      ru:'Создать'
    }
  },
  {
    key: 'My Profile',
    text: 'My Profile',
    link: 'profile',
    isDisabled: false,
    textForLink:{
      en:'My Profile',
      ru:'Профиль'
    }
  },
  {
    key: 'Messenger',
    text: 'Messenger',
    link: '',
    isDisabled: false,
    textForLink:{
      en:'Messenger',
      ru:'Сообщения'
    }
  },
  {
    key: 'Search',
    text: 'Search',
    link: '',
    isDisabled: false,
    textForLink:{
      en:'Search',
      ru:'Поиск'
    }
  },
  {
    key: 'Statistics',
    text: 'Statistics',
    link: '',
    isDisabled: false,
    textForLink:{
      en:'Statistics',
      ru:'Статистика'
    }
  },
  {
    key: 'Favorites',
    text: 'Favorites',
    link: '',
    isDisabled: false,
    textForLink:{
      en:'Favorites',
      ru:'Избранное'
    }
  },
  {
    key: 'Log Out',
    text: 'Log Out',
    link: '',
    isDisabled: false,
    onclick: true,
    textForLink:{
      en:'Log Out',
      ru:'Выйти'
    }
  },
]
