export default class Card {
  public symbol: string;
  public value: number;
  public description: string;
  public isSpecial: boolean;

  constructor (params: {
    symbol: string,
    description?: string,
    value?: number,
    isSpecial: boolean,
  }) {
    this.symbol = params.symbol;
    this.description = params.description;
    this.value = params.value;
    this.isSpecial = params.isSpecial;
  }
}
