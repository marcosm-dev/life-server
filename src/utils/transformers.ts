// export npm install --save-dev eslint-config-prettier eslint-plugin-prettier
export function calcExpiresDate(date: Date, seconds: number): Date {
  const startDate = new Date(date)

  // Verifica si la fecha es válida antes de continuar
  if (isNaN(startDate.getTime())) throw new Error('Fecha de partida inválida.')
  return new Date(startDate.getTime() + seconds * 1000)
}
