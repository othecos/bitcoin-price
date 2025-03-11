import { BitcoinService } from "./bitcoin.service";
import { BitcoinController } from "./bitcoin.controller";
import { BinanceGateway } from "./gateways/binance.gateway";
import { BitcoinPriceRepositoryType } from "../../entities/BitcoinPrice";

export class BitcoinFactory {
  static createService(repository: BitcoinPriceRepositoryType): BitcoinService {
    const gateway = new BinanceGateway();
    return new BitcoinService(repository, gateway);
  }

  static createController(service: BitcoinService): BitcoinController {
    return new BitcoinController(service);
  }
}
