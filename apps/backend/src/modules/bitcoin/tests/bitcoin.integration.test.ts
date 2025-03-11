import { AppDataSource } from "../../../data-source";
import { BitcoinFactory } from "../bitcoin.factory";
import { BitcoinPrice } from "../../../entities/BitcoinPrice";

describe("Bitcoin Integration", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should save and retrieve bitcoin prices", async () => {
    const repository = AppDataSource.getRepository(BitcoinPrice);
    const service = BitcoinFactory.createService(repository);

    // Save bitcoin price
    await service.saveBitcoinPrice(50000);

    // Get latest price
    const latestPrice = await service.getLatestPrice();
    expect(latestPrice).toBe(50000);
  });
  it("should return history of bitcoin prices", async () => {
    const repository = AppDataSource.getRepository(BitcoinPrice);
    const service = BitcoinFactory.createService(repository);

    // Save bitcoin price
    await service.saveBitcoinPrice(50000);

    // Get history
    const history = await service.getPriceHistory(10);
    expect(history.length).toBeGreaterThan(0);
    expect(history.length).toBeLessThanOrEqual(10);
    // First price should be the saved price
    expect(history[0].price).toBe(50000);
  });
});
