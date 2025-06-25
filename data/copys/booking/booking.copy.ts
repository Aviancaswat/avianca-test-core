import type { copysType } from "../../../types/copy.type";
import { copys } from "../../copys";

//nuevas propiedades para HU
interface example extends Partial<copysType> {
     is_upgrade_choice: boolean
}

const bookingCopy: example = {
    ...copys,
    is_upgrade_choice: true, // o '.cro-button.cro-no-accept-upsell-button'
}

export { bookingCopy };