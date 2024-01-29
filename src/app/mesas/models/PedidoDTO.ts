import { ComandaDTO } from "src/app/models/ComandaDTO";
import { Platillo } from "src/app/platillos/models/Platillo";

export class PedidoDTO {
    comandaDTO : ComandaDTO = new ComandaDTO();
    platillosComanda : Platillo[] = [];
}