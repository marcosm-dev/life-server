export function calcExpiresDate(date, seconds) {
    const startDate = new Date(date);
    if (isNaN(startDate.getTime()))
        throw new Error('Fecha de partida inválida.');
    return new Date(startDate.getTime() + seconds * 1000);
}
