// Словарь для интернационализации приложения Inctagram
// Поддерживаемые языки: английский (en) и русский (ru)

export type Language = 'en' | 'ru';

export interface Messages {
  // Общие элементы
  common: {
    loading: string;
    cancel: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    error: string;
    success: string;
  };

  // Навигация и заголовки
  navigation: {
    home: string;
    profile: string;
    feed: string;
    create: string;
    messenger: string;
    statistics: string;
    favorites: string;
    search: string;
    settings: string;
    logOut: string;
  };

  // Аутентификация
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    logIn: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    enterEmail: string;
    enterPassword: string;
    enterUsername: string;
    repeatPassword: string;
    rememberMe: string;
    doYouHaveAccount: string;
    dontHaveAccount: string;
    emailSent: string;
    emailSentDescription: string;
    invalidEmail: string;
    invalidPassword: string;
    passwordMismatch: string;
    passwordRequirements: string;
    usernameRequirements: string;
    agreeToTerms: string;
    termsOfService: string;
    privacyPolicy: string;
    emailVerification: string;
    verifyEmail: string;
    resendCode: string;
    accountCreated: string;
  };

  // Профиль пользователя
  profile: {
    myProfile: string;
    editProfile: string;
    profileSettings: string;
    avatar: string;
    changeAvatar: string;
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
    website: string;
    birthDate: string;
    followers: string;
    following: string;
    posts: string;
    accountType: string;
    publicAccount: string;
    privateAccount: string;
    noSearchUsers:string;
    noUsersShow:string;
    thatsAll: string;
    publications:string;
    follow:string;
    unFollow:string;
    delete:string;
    sendMessage: string;
  };

  // Посты и контент
  posts: {
    newPost: string;
    createPost: string;
    addPhoto: string
    editPost: string;
    deletePost: string;
    post: string;
    posts: string;
    caption: string;
    addCaption: string;
    like: string;
    likes: string;
    comment: string;
    comments: string;
    share: string;
    report: string;
    savePost: string;
    unsavePost: string;
    postDeleted: string;
    noPostsYet: string;
  };

  // Уведомления
  notifications: {
    notification: string;
    notifications: string;
    newFollower: string;
    newLike: string;
    newComment: string;
    newMessage: string;
    markAllRead: string;
    noNotifications: string;
  };

  // Мессенджер
  messenger: {
    messages: string;
    newMessage: string;
    sendMessage: string;
    typeMessage: string;
    conversation: string;
    conversations: string;
    online: string;
    offline: string;
    lastSeen: string;
    deleteConversation: string;
    noMessages: string;
  };

  // Настройки
  settings: {
    settings: string;
    accountSettings: string;
    privacySettings: string;
    notificationSettings: string;
    languageSettings: string;
    changeLanguage: string;
    darkMode: string;
    lightMode: string;
    theme: string;
    deleteAccount: string;
    deactivateAccount: string;
    close: string
    save: string
  };

  // Ошибки и валидация
  errors: {
    requiredField: string;
    invalidFormat: string;
    tooShort: string;
    tooLong: string;
    passwordTooWeak: string;
    emailExists: string;
    usernameExists: string;
    userNotFound: string;
    wrongPassword: string;
    networkError: string;
    serverError: string;
    sessionExpired: string;
    accessDenied: string;
    fileTooBig: string;
    invalidFileType: string;
  };

  // Модальные окна
  modals: {
    confirmLogout: string;
    confirmDelete: string;
    confirmLogoutMessage: string;
    confirmDeleteMessage: string;
    areYouSure: string;
    thisActionCannotBeUndone: string;
    unfollowConfirm: string;
    deleteFollowConfirm: string;
    deleteFollowing: string;
    closeModalWarningBegin: string
    closeModalwarningQSecondPart: string
    discard: string;
    selectPhoto:string
    openDraft: string;
  };

  // Языки
  languages: {
    english: string;
    russian: string;
    selectLanguage: string;
  };
}

export const messages: Record<Language, Messages> = {
  en: {
    common: {
      loading: 'Loading...',
      cancel: 'Cancel',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      error: 'Error',
      success: 'Success',
    },

    navigation: {
      home: 'Home',
      profile: 'Profile',
      feed: 'Feed',
      create: 'Create',
      messenger: 'Messenger',
      statistics: 'Statistics',
      favorites: 'Favorites',
      search: 'Search',
      settings: 'Settings',
      logOut: 'Log Out',
    },

    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      logIn: 'Log in',
      register: 'Register',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Password',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Password confirmation',
      username: 'Username',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterUsername: 'Enter your username',
      repeatPassword: 'Repeat your password',
      rememberMe: 'Remember me',
      doYouHaveAccount: 'Do you have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      emailSent: 'Email sent',
      emailSentDescription: 'We have sent a link to confirm your email to',
      invalidEmail: 'The email must match the format example@example.com',
      invalidPassword: 'Enter your password',
      passwordMismatch: 'Passwords must match',
      passwordRequirements: 'Password must be longer than 5 characters',
      usernameRequirements: 'You can only use letters, numbers, _ and -',
      agreeToTerms: 'I agree to the',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      emailVerification: 'Email Verification',
      verifyEmail: 'Verify Email',
      resendCode: 'Resend Code',
      accountCreated: 'Account created successfully',
    },

    profile: {
      myProfile: 'My Profile',
      editProfile: 'Edit Profile',
      profileSettings: 'Profile Settings',
      avatar: 'Avatar',
      changeAvatar: 'Change Avatar',
      firstName: 'First Name',
      lastName: 'Last Name',
      bio: 'Bio',
      location: 'Location',
      website: 'Website',
      birthDate: 'Birth Date',
      followers: 'Followers',
      following: 'Following',
      posts: 'Posts',
      accountType: 'Account Type',
      publicAccount: 'Public Account',
      privateAccount: 'Private Account',
      noSearchUsers:'No users match your search',
      noUsersShow:'No users to show',
      thatsAll:'That’s all',
      publications:'publications',
      follow:'Follow',
      unFollow:'Unfollow',
      delete:'Delete',
      sendMessage: 'Send Message',
    },

    posts: {
      newPost: 'New Post',
      addPhoto: 'Add Photo',
      createPost: 'Create Post',
      editPost: 'Edit Post',
      deletePost: 'Delete Post',
      post: 'Post',
      posts: 'Posts',
      caption: 'Caption',
      addCaption: 'Add a caption...',
      like: 'Like',
      likes: 'Likes',
      comment: 'Comment',
      comments: 'Comments',
      share: 'Share',
      report: 'Report',
      savePost: 'Save Post',
      unsavePost: 'Unsave Post',
      postDeleted: 'Post deleted',
      noPostsYet: 'No posts yet',
    },

    notifications: {
      notification: 'Notification',
      notifications: 'Notifications',
      newFollower: 'started following you',
      newLike: 'liked your post',
      newComment: 'commented on your post',
      newMessage: 'sent you a message',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
    },

    messenger: {
      messages: 'Messages',
      newMessage: 'New Message',
      sendMessage: 'Send Message',
      typeMessage: 'Type a message...',
      conversation: 'Conversation',
      conversations: 'Conversations',
      online: 'Online',
      offline: 'Offline',
      lastSeen: 'Last seen',
      deleteConversation: 'Delete Conversation',
      noMessages: 'No messages yet',
    },

    settings: {
      settings: 'Settings',
      accountSettings: 'Account Settings',
      privacySettings: 'Privacy Settings',
      notificationSettings: 'Notification Settings',
      languageSettings: 'Language Settings',
      changeLanguage: 'Change Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      theme: 'Theme',
      deleteAccount: 'Delete Account',
      deactivateAccount: 'Deactivate Account',
    },

    errors: {
      requiredField: 'This field is required',
      invalidFormat: 'Invalid format',
      tooShort: 'Too short',
      tooLong: 'Too long',
      passwordTooWeak: 'Password is too weak',
      emailExists: 'Email already exists',
      usernameExists: 'Username already exists',
      userNotFound: 'User not found',
      wrongPassword: 'Wrong password',
      networkError: 'Network error',
      serverError: 'Server error',
      sessionExpired: 'Session expired',
      accessDenied: 'Access denied',
      fileTooBig: 'File is too big',
      invalidFileType: 'Invalid file type',
    },

    modals: {
      confirmLogout: 'Confirm Logout',
      confirmDelete: 'Confirm Delete',
      confirmLogoutMessage: 'Are you really want to log out of your account',
      confirmDeleteMessage: 'Are you sure you want to delete this item?',
      areYouSure: 'Are you sure?',
      thisActionCannotBeUndone: 'This action cannot be undone',
      unfollowConfirm:'Do you really want to Unfollow from this user ',
      deleteFollowConfirm:'Do you really want to delete a Following ',
      deleteFollowing: 'Delete Following',
      closeModalWarningBegin: 'Do you really want to close the creation of a publication?',
      closeModalwarningQSecondPart: 'If you close everything will be deleted',
      discard: 'Discard',
      selectPhoto:'Select from Computer',
      openDraft:'Open draft'
    },

    languages: {
      english: 'English',
      russian: 'Russian',
      selectLanguage: 'Select Language',
    },
  },

  ru: {
    common: {
      loading: 'Загрузка...',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      yes: 'Да',
      no: 'Нет',
      ok: 'ОК',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      close: 'Закрыть',
      back: 'Назад',
      next: 'Далее',
      previous: 'Предыдущий',
      search: 'Поиск',
      error: 'Ошибка',
      success: 'Успех',
    },

    navigation: {
      home: 'Главная',
      profile: 'Профиль',
      feed: 'Лента',
      create: 'Создать',
      messenger: 'Сообщения',
      statistics: 'Статистика',
      favorites: 'Избранное',
      search: 'Поиск',
      settings: 'Настройки',
      logOut: 'Выйти',
    },

    auth: {
      signIn: 'Войти',
      signUp: 'Регистрация',
      signOut: 'Выйти',
      logIn: 'Войти',
      register: 'Зарегистрироваться',
      forgotPassword: 'Забыли пароль',
      resetPassword: 'Сбросить пароль',
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтверждение пароля',
      username: 'Имя пользователя',
      enterEmail: 'Введите вашу электронную почту',
      enterPassword: 'Введите ваш пароль',
      enterUsername: 'Введите имя пользователя',
      repeatPassword: 'Повторите пароль',
      rememberMe: 'Запомнить меня',
      doYouHaveAccount: 'У вас есть аккаунт?',
      dontHaveAccount: 'Нет аккаунта?',
      emailSent: 'Письмо отправлено',
      emailSentDescription: 'Мы отправили ссылку для подтверждения вашей электронной почты на',
      invalidEmail: 'Электронная почта должна соответствовать формату example@example.com',
      invalidPassword: 'Введите ваш пароль',
      passwordMismatch: 'Пароли не совпадают',
      passwordRequirements: 'Пароль должен содержать более 5 символов',
      usernameRequirements: 'Можно использовать только буквы, цифры, _ и -',
      agreeToTerms: 'Я согласен с',
      termsOfService: 'Условиями использования',
      privacyPolicy: 'Политикой конфиденциальности',
      emailVerification: 'Подтверждение электронной почты',
      verifyEmail: 'Подтвердить электронную почту',
      resendCode: 'Отправить код повторно',
      accountCreated: 'Аккаунт успешно создан',
    },

    profile: {
      myProfile: 'Мой профиль',
      editProfile: 'Редактировать профиль',
      profileSettings: 'Настройки профиля',
      avatar: 'Аватар',
      changeAvatar: 'Изменить аватар',
      firstName: 'Имя',
      lastName: 'Фамилия',
      bio: 'О себе',
      location: 'Местоположение',
      website: 'Веб-сайт',
      birthDate: 'Дата рождения',
      followers: 'Подписчики',
      following: 'Подписки',
      posts: 'Публикации',
      accountType: 'Тип аккаунта',
      publicAccount: 'Публичный аккаунт',
      privateAccount: 'Приватный аккаунт',
      noSearchUsers:'Нет пользователей, соответствующих вашему поиску',
      noUsersShow:'Нет пользователей для отображения',
      thatsAll:'Все загружено',
      publications:'Публикаций',
      follow:'Подписаться',
      unFollow:'Отписаться',
      delete:'Удалить',
      sendMessage: 'Отправить сообщение'
    },

    posts: {
      newPost: 'Новая публикация',
      addPhoto: 'Добавить фото',
      createPost: 'Создать публикацию',
      editPost: 'Редактировать публикацию',
      deletePost: 'Удалить публикацию',
      post: 'Публикация',
      posts: 'Публикации',
      caption: 'Подпись',
      addCaption: 'Добавить подпись...',
      like: 'Нравится',
      likes: 'Отметки "Нравится"',
      comment: 'Комментарий',
      comments: 'Комментарии',
      share: 'Поделиться',
      report: 'Пожаловаться',
      savePost: 'Сохранить публикацию',
      unsavePost: 'Убрать из сохраненных',
      postDeleted: 'Публикация удалена',
      noPostsYet: 'Пока нет публикаций',
    },

    notifications: {
      notification: 'Уведомление',
      notifications: 'Уведомления',
      newFollower: 'подписался на вас',
      newLike: 'оценил вашу публикацию',
      newComment: 'прокомментировал вашу публикацию',
      newMessage: 'прислал вам сообщение',
      markAllRead: 'Отметить все как прочитанные',
      noNotifications: 'Нет уведомлений',
    },

    messenger: {
      messages: 'Сообщения',
      newMessage: 'Новое сообщение',
      sendMessage: 'Отправить сообщение',
      typeMessage: 'Введите сообщение...',
      conversation: 'Беседа',
      conversations: 'Беседы',
      online: 'В сети',
      offline: 'Не в сети',
      lastSeen: 'Был в сети',
      deleteConversation: 'Удалить беседу',
      noMessages: 'Пока нет сообщений',
    },

    settings: {
      settings: 'Настройки',
      accountSettings: 'Настройки аккаунта',
      privacySettings: 'Настройки приватности',
      notificationSettings: 'Настройки уведомлений',
      languageSettings: 'Настройки языка',
      changeLanguage: 'Изменить язык',
      darkMode: 'Темная тема',
      lightMode: 'Светлая тема',
      theme: 'Тема',
      deleteAccount: 'Удалить аккаунт',
      deactivateAccount: 'Деактивировать аккаунт',
    },

    errors: {
      requiredField: 'Это поле обязательно для заполнения',
      invalidFormat: 'Неверный формат',
      tooShort: 'Слишком короткий',
      tooLong: 'Слишком длинный',
      passwordTooWeak: 'Пароль слишком слабый',
      emailExists: 'Электронная почта уже существует',
      usernameExists: 'Имя пользователя уже существует',
      userNotFound: 'Пользователь не найден',
      wrongPassword: 'Неверный пароль',
      networkError: 'Ошибка сети',
      serverError: 'Ошибка сервера',
      sessionExpired: 'Сессия истекла',
      accessDenied: 'Доступ запрещен',
      fileTooBig: 'Файл слишком большой',
      invalidFileType: 'Неверный тип файла',
    },

    modals: {
      confirmLogout: 'Подтвердить выход',
      confirmDelete: 'Подтвердить удаление',
      confirmLogoutMessage: 'Вы действительно хотите выйти из своего аккаунта',
      confirmDeleteMessage: 'Вы уверены, что хотите удалить этот элемент?',
      areYouSure: 'Вы уверены?',
      thisActionCannotBeUndone: 'Это действие нельзя отменить',
      unfollowConfirm:'Вы действительно хотите отписаться от этого пользователя ',
      deleteFollowConfirm:'Вы действительно хотите удалить подписку ',
      deleteFollowing:'Удалить подписку',
      closeModalWarningBegin: 'Вы действительно хотите закрыть создание публикации?',
      closeModalwarningQSecondPart: 'Если вы закроете, все будет удалено',
      discard: 'Сбросить',
      selectPhoto:'Выбрать на компьютере',
      openDraft:'Открыть черновик'
    },

    languages: {
      english: 'Английский',
      russian: 'Русский',
      selectLanguage: 'Выберите язык',
    },
  },
};

// Функция для получения сообщений по языку
export const getMessages = (language: Language): Messages => {
  return messages[language] || messages.en;
};

// Функция для получения конкретного сообщения
// Закоментировали так как функция не используется - уточнить у Иры нужна ли
// export const getMessage = (
//   language: Language,
//   key: string,
//   fallback?: string
// ): string => {
//   const msgs = getMessages(language);
//   const keys = key.split('.');
//   let value: any = msgs;
//
//   for (const k of keys) {
//     value = value?.[k];
//   }
//
//   return typeof value === 'string' ? value : (fallback || key);
// };

// Экспорт по умолчанию

