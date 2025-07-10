
interface SeatCopy {
    tarifaDeAsientos: string,
    es: {
        pagar: string,
    },
    en: {
        pagar: string,
    },
    pt: {
        pagar: string,
    },
    fr: {
        pagar: string,
    },
}

export const copySeat: SeatCopy = {
    tarifaDeAsientos: 'economy',
    es: {
        pagar: 'Ir a pagar',
    },
    en: {
        pagar: 'Go to payment',
    },
    pt: {
        pagar: 'Vá pagar',
    },
    fr: {
        pagar: 'Continuer',
    },
    
}