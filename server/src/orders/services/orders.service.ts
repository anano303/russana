import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentResult } from 'src/interfaces';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Product } from '../../products/schemas/product.schema';
import { ProductsService } from '@/products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private productsService: ProductsService,
  ) {}

  async create(
    orderAttrs: Partial<Order>,
    userId: string,
  ): Promise<OrderDocument> {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = orderAttrs;

    if (orderItems && orderItems.length < 1)
      throw new BadRequestException('No order items received.');

    try {
      // Enhance order items with product delivery information
      const enhancedOrderItems = await Promise.all(
        orderItems.map(async (item) => {
          const product = await this.productModel.findById(item.productId);
          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          return {
            ...item,
            // Ensure size, color, and ageGroup are included from the order item
            size: item.size || '',
            color: item.color || '',
            ageGroup: item.ageGroup || '',
            product: {
              _id: product._id,
              name: product.name,
              nameEn: product.nameEn,
              deliveryType: product.deliveryType,
              minDeliveryDays: product.minDeliveryDays,
              maxDeliveryDays: product.maxDeliveryDays,
              dimensions: product.dimensions
                ? {
                    width: product.dimensions.width,
                    height: product.dimensions.height,
                    depth: product.dimensions.depth,
                  }
                : undefined,
            },
          };
        }),
      );

      const createdOrder = await this.orderModel.create({
        user: userId,
        orderItems: enhancedOrderItems,
        shippingDetails,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      return createdOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findAll(): Promise<OrderDocument[]> {
    // Sort by createdAt in descending order (newest first)
    const orders = await this.orderModel
      .find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return orders;
  }

  async findById(id: string): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email');

    if (!order) throw new NotFoundException('No order with given ID.');

    return order;
  }

  async updatePaid(
    id: string,
    paymentResult: PaymentResult,
  ): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isPaid = true;
    order.paidAt = Date();
    order.paymentResult = paymentResult;

    // Update product quantities after successful payment
    for (const item of order.orderItems) {
      try {
        // Use the products service method to update stock
        await this.productsService.updateStockAfterPayment(
          item.productId.toString(),
          item.qty,
          item.size,
          item.color,
          item.ageGroup,
        );
      } catch (error) {
        console.error(
          `Error updating stock for product ${item.productId}:`,
          error,
        );
        // Continue processing other items even if one fails
      }
    }

    const updatedOrder = await order.save();

    return updatedOrder;
  }

  async updateDelivered(id: string): Promise<OrderDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order ID.');

    const order = await this.orderModel.findById(id);

    if (!order) throw new NotFoundException('No order with given ID.');

    order.isDelivered = true;
    order.deliveredAt = Date();

    const updatedOrder = await order.save();

    return updatedOrder;
  }

  async findUserOrders(userId: string) {
    // Sort by createdAt in descending order (newest first)
    const orders = await this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return orders;
  }
}
