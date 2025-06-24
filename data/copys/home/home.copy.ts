import type { copysType } from "../../../types/copy.type";
import { copys } from "../../copys";

//nuevas propiedades para HU
interface example extends Partial<copysType> {
    //nuevas propiedades de mi HU
}

const newCopy: example = {
    ...copys,
    ciudad_origen: 'MDE'
}

export { newCopy };