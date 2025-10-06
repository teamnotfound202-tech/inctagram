// features/postView/utils/url-utils.ts
export const cleanSearchParams = (searchParams: { [key: string]: string | string[] | undefined }) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        // Исключаем конфликтующие параметры
        if (key !== 'action' && value) {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else {
                params.set(key, value);
            }
        }
    });

    return params;
};