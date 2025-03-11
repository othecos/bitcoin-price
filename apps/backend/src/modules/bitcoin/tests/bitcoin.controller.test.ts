import { BitcoinService } from "../bitcoin.service";
import { BitcoinController } from "../bitcoin.controller";
import { Request, Response } from "express";

describe("BitcoinController", () => {
  let controller: BitcoinController;
  let mockService: jest.Mocked<
    Pick<
      BitcoinService,
      | "getLatestPrice"
      | "fetchBitcoinPrice"
      | "saveBitcoinPrice"
      | "getPriceHistory"
      | "setupBitcoinPriceUpdates"
      | "updateBitcoinPrice"
    >
  >;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getLatestPrice: jest.fn(),
      fetchBitcoinPrice: jest.fn(),
      saveBitcoinPrice: jest.fn(),
      getPriceHistory: jest.fn(),
      setupBitcoinPriceUpdates: jest.fn(),
      updateBitcoinPrice: jest.fn(),
    };

    mockRequest = {
      query: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    controller = new BitcoinController(
      mockService as unknown as BitcoinService,
    );
  });

  describe("getLatestPrice", () => {
    it("should return cached price when available", async () => {
      mockService.getLatestPrice.mockResolvedValue(50000);

      await controller.getLatestPrice(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ price: 50000 });
    });

    it("should fetch new price when cache is empty", async () => {
      mockService.getLatestPrice.mockResolvedValue(null);
      mockService.fetchBitcoinPrice.mockResolvedValue(45000);

      await controller.getLatestPrice(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockService.saveBitcoinPrice).toHaveBeenCalledWith(45000);
      expect(mockResponse.json).toHaveBeenCalledWith({ price: 45000 });
    });
  });
});
