export  const isWeekend = (date:Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = воскресенье, 6 = суббота
};
export const formatDate = (date: Date) => {
    if (!date) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};