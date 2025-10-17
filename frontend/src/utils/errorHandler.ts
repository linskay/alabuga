// Утилита для обработки ошибок от бекенда
export const handleApiError = (error: any, defaultTitle: string = 'Ошибка', defaultMessage: string = 'Произошла ошибка') => {
  // Если это ошибка валидации от бекенда
  if (error?.response?.data?.title && error?.response?.data?.message) {
    return {
      title: error.response.data.title,
      message: error.response.data.message,
      variant: 'error' as const
    };
  }
  
  // Если есть только сообщение
  if (error?.response?.data?.message) {
    return {
      title: defaultTitle,
      message: error.response.data.message,
      variant: 'error' as const
    };
  }
  
  // Если есть только текст ошибки
  if (error?.message) {
    return {
      title: defaultTitle,
      message: error.message,
      variant: 'error' as const
    };
  }
  
  // Дефолтная ошибка
  return {
    title: defaultTitle,
    message: defaultMessage,
    variant: 'error' as const
  };
};
