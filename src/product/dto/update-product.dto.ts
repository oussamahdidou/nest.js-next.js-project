
export class UpdateProductDto {
    readonly id: number;
    readonly name?: string;
    readonly price?: number;
    readonly fragility?: boolean;
    readonly weight?: number;
    readonly dimensions?: number;
  }
  