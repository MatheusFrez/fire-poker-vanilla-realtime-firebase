export default class Card {
  public symbol: string;
  public value: number;
  public description: string;

  constructor (params: {
    symbol: string,
    description: string,
    value: number
  }) {
    this.symbol = params.symbol;
    this.description = params.description;
    this.value = params.value;
  }
}
