import bancosESistema from "./bancos-e-sistema";
import cartaoSemSusto from "./cartao-sem-susto";
import cdbNaPratica from "./cdb-na-pratica";
import golpesESeguranca from "./golpes-e-seguranca";
import grandesObjetivos from "./grandes-objetivos";
import jurosEDividas from "./juros-e-dividas";
import organizarMes from "./organizar-mes";
import primeirosInvestimentos from "./primeiros-investimentos";
import primeirosPassos from "./primeiros-passos";
import reservaEmergencia from "./reserva-emergencia";
import rendaFixa from "./renda-fixa";
import trabalhoERenda from "./trabalho-e-renda";
import type { UnitDef } from "./types";

// Para criar uma unidade: novo arquivo com defineUnit(...) e registrá-lo aqui.
export const UNIT_BANK: UnitDef[] = [
  primeirosPassos,
  organizarMes,
  cartaoSemSusto,
  golpesESeguranca,
  reservaEmergencia,
  jurosEDividas,
  rendaFixa,
  cdbNaPratica,
  bancosESistema,
  trabalhoERenda,
  grandesObjetivos,
  primeirosInvestimentos,
];
