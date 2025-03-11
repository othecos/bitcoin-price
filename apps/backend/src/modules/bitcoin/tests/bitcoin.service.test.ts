import { BitcoinService } from "../bitcoin.service";
import { Server } from "socket.io";
import { BitcoinPriceRepositoryType } from "../../../entities/BitcoinPrice";
import { BinanceGateway } from "../gateways/binance.gateway";
describe("BitcoinService", () => {
  let service: BitcoinService;
  let mockRepository: jest.Mocked<
    Pick<BitcoinPriceRepositoryType, "find" | "create" | "save">
  >;
  let mockGateway: jest.Mocked<BinanceGateway>;
  let mockIo: jest.Mocked<Pick<Server, "emit">>;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockGateway = {
      getLatestPrice: jest.fn(),
      getProviderName: jest.fn(),
    };
    mockIo = {
      emit: jest.fn(),
    };

    service = new BitcoinService(
      mockRepository as unknown as BitcoinPriceRepositoryType,
      mockGateway,
    );
  });

  describe("getLatestPrice", () => {
    it("should return latest price when available", async () => {
      mockRepository.find.mockResolvedValue([
        { price: 50000, currency: "USD", timestamp: new Date(), id: 1 },
      ]);
      const result = await service.getLatestPrice();
      expect(result).toBe(50000);
    });

    it("should return null when no prices exist", async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.getLatestPrice();
      expect(result).toBeNull();
    });
  });

  describe("updateBitcoinPrice", () => {
    it("should fetch, save and emit new price", async () => {
      mockGateway.getLatestPrice.mockResolvedValue(45000);
      mockRepository.create.mockReturnValue({
        price: 45000,
        currency: "USD",
        timestamp: new Date(),
        id: 1,
      });

      await service.updateBitcoinPrice(mockIo as unknown as Server);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockIo.emit).toHaveBeenCalledWith("bitcoin:price-update", {
        price: 45000,
      });
    });
  });
});
