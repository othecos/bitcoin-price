import { Router } from "express";
import { BitcoinFactory } from "./bitcoin.factory";
import { BitcoinService } from "./bitcoin.service";

export const createBitcoinRoutes = ({
  service,
}: {
  service: BitcoinService;
}): Router => {
  const router = Router();
  const controller = BitcoinFactory.createController(service);

  router.get("/price", (req, res) => controller.getLatestPrice(req, res));
  router.get("/history", (req, res) => controller.getPriceHistory(req, res));

  return router;
};
