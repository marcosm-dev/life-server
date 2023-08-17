export function calcExpiresDate(date: any, seconds: number) {
  const startDate = new Date(date)
  
  // Verifica si la fecha es válida antes de continuar
  if (isNaN(startDate.getTime())) throw new Error('Fecha de partida inválida.')
  return new Date(startDate.getTime() + seconds * 1000)
}
