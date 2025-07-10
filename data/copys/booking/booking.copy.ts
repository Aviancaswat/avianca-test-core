
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
}

export const copyBooking: BookingCopy = {
    editFlightSelected: true,
    numero_vuelo_ida:'1',
    numero_vuelo_regreso:'1',
    consulta_condiciones_tarifa:false,
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
    }
}