import type { copysType } from "../../../types/copy.type";
import { copys } from "../../copys";

//nuevas propiedades para HU
interface example extends Partial<copysType> {
     is_upgrade_choice: boolean,
     is_update_flight: boolean,

}

const bookingCopy: example = {
    ...copys,
    is_upgrade_choice: false,
    is_update_flight: true,
    ciudad_origen: 'CLO',
    ciudad_destino: 'FLL',
}

export { bookingCopy };