
interface BookingCopy {
    editFlightSelected: boolean,    
    numero_vuelo_ida: string,
    numero_vuelo_regreso: string,
    consulta_condiciones_tarifa:boolean,
    es: {
        informacion_tarifas: string,
    },
    en: {
        informacion_tarifas: string,
    },
    pt: {
        informacion_tarifas: string,
    },
    fr: {
        informacion_tarifas: string,
    },
    departure_flight_fare: "light" | "basic" | "classic" | "flex" | "insignia" | "business",
    return_flight_fare: "light" | "basic" | "classic" | "flex" | "insignia" | "business",
    withdrawal_and_desistance:boolean
}

export const copyBooking: BookingCopy = {
    editFlightSelected: true,
    numero_vuelo_ida:'12',
    numero_vuelo_regreso:'8',
    consulta_condiciones_tarifa:true,
    es: {
        informacion_tarifas: 'condiciones de tu tarifa',
    },
    en: {
        informacion_tarifas: 'conditions of your fare',
    },
    pt: {
        informacion_tarifas: 'condições da sua tarifa',
    },
    fr: {
        informacion_tarifas: 'conditions de votre tarif',
    },
    departure_flight_fare: "classic",
    return_flight_fare: "flex",
    withdrawal_and_desistance:true
}