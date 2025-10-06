export function timeToTimeZone(time: string | Date) {
    const date = new Date(time);
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}