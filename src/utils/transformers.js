"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcExpiresDate = void 0;
function calcExpiresDate(date, seconds) {
    var startDate = new Date(date);
    // Verifica si la fecha es válida antes de continuar
    if (isNaN(startDate.getTime()))
        throw new Error('Fecha de partida inválida.');
    return new Date(startDate.getTime() + seconds * 1000);
}
exports.calcExpiresDate = calcExpiresDate;
