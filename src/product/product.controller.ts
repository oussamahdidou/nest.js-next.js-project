import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProduct } from './decorator/get-product.decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('mine')
  findMyAll(@GetUser('id') user_id: string) {
    return this.productService.findMyAll(user_id);
  }

  @Get('info')
  findOne(@GetProduct('id') productId: number) {
    console.log({ productId });
    return this.productService.findOne(productId);
  }

  @Post()
  create(
    @GetUser('id') user_id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto, user_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
