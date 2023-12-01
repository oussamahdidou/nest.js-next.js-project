
export class CreatePackageDto {
    readonly id: number;
    readonly weight: number;
    readonly dimensions: number;
  }
  
 
  export class UpdatePackageDto {
    readonly id ?: number;
    readonly weight?: number;
    readonly dimensions?: number;
  }
  