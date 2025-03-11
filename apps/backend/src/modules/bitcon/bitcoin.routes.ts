import { Router } from "express";
import { BitcoinController } from "./bitcoin.controller";
import { AppDataSource } from "../../data-source";
import { BitcoinPrice } from "../../entities/BitcoinPrice";

const router = Router();
const bitcoinController = new BitcoinController(
  AppDataSource.getRepository(BitcoinPrice)
);

router.get("/price", (req, res) => bitcoinController.getLatestPrice(req, res));
router.get("/history", (req, res) =>
  bitcoinController.getPriceHistory(req, res)
);

export const bitcoinRoutes: Router = router;
