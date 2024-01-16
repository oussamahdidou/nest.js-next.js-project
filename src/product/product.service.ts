import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Owner } from 'src/entities';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
    private waerhoseService: WarehouseService,
  ) {}

  findAll() {
    return this.productRepository.find();
  }

  findMyAll(user_id: string) {
    return this.productRepository.find({
      where: {
        owner: {
          id: user_id,
        },
      },
    });
  }

  async findOne(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOneById(id);
  }

  async create(
    createProductDto: CreateProductDto,
    userId: string,
  ): Promise<Product> {
    const owner = await this.ownerRepository.findOne({
      where: {
        id: userId,
      },
    });
    const startWarehouse = await this.waerhoseService.findById(
      createProductDto.startWarehouse,
    );
    const destination = await this.waerhoseService.findById(
      createProductDto.destination,
    );
    if (!owner) {
      throw new NotFoundException(`Owner with id ${userId} not found`);
    }
    if (!startWarehouse) {
      throw new Error('Start warehouse not found');
    }

    if (!destination) {
      throw new Error('Destination warehouse not found');
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      startWarehouse,
      destination,
      owner,
    });
    return this.productRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productRepository.preload({
      productId: +id,
      ...updateProductDto,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product ${id} is not found`);
    }

    return this.productRepository.save(updatedProduct);
  }
  async remove(id: number) {
    const existingProduct = await this.findOne(id);
    return this.productRepository.remove(existingProduct);
  }

  async findProducts(productIds: number[]): Promise<Product[]> {
    if (productIds.length === 0) {
      throw new BadRequestException('Product IDs are required');
    }

    const products = await Promise.all(
      productIds.map(async (id) => {
        const product = await this.findOne(id);
        if (!product) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
      }),
    );

    return products;
  }
}
