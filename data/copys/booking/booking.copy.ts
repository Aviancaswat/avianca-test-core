import { copysType } from "../../../types/copy.type";

interface BookingCopy extends Partial<copysType> {
    editFlightSelected: boolean
}

export const copyBooking: BookingCopy = {
    editFlightSelected: true
}