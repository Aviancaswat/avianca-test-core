import type { copysType } from "../../../types/copy.type";
import { copys } from "../../copys";

interface example extends Partial<copysType> {
    isActiveOptionOutbound: boolean
}

const HomeCopy: example = {
    ...copys,
    isActiveOptionOutbound: false, //está activo el vuelo de ida
}

export { HomeCopy };