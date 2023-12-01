import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

   findAll(){
    return this.productRepository.find();
  }
  
  async findOne(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOneById(id);
  }
  

   create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productRepository.preload({
      id: +id,
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
}
