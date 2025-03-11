export interface BitcoinPriceGateway {
  /**
   * Get the latest Bitcoin price in USD
   * @returns Promise with the current Bitcoin price as a number
   */
  getLatestPrice(): Promise<number>;

  /**
   * Get the provider name
   * @returns The name of the price provider
   */
  getProviderName(): string;
}
