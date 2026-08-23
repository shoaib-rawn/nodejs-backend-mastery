import { prisma } from '../config/prisma.config.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function addToCartService(userId: number, storeId: number, productId: number, quantity: number) {
  // 1. Verify product exists and belongs to target store tenant
  const product = await prisma.product.findFirst({
    where: { id: productId, storeId }
  });

  if (!product) {
    throw new AppError('Product not found in this store tenant', 404);
  }

  // 2. Check stock availability
  if (product.stock < quantity) {
    throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);
  }

  // 3. Upsert cart item (Increment quantity if already in cart)
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError(`Cannot add more items. Total requested ${newQuantity} exceeds stock ${product.stock}`, 400);
    }

    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity },
      include: {
        product: {
          select: { id: true, name: true, price: true, images: true, stock: true }
        }
      }
    });
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    },
    include: {
      product: {
        select: { id: true, name: true, price: true, images: true, stock: true }
      }
    }
  });
}

export async function getCartService(userId: number, storeId: number) {
  // Fetch cart items belonging to user for products in target store
  const items = await prisma.cartItem.findMany({
    where: {
      userId,
      product: { storeId }
    },
    include: {
      product: {
        select: { id: true, name: true, price: true, images: true, stock: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate cart totals
  let subtotal = 0;
  let totalItems = 0;

  const formattedItems = items.map(item => {
    const itemSubtotal = Number(item.product.price) * item.quantity;
    subtotal += itemSubtotal;
    totalItems += item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      title: item.product.name,
      price: Number(item.product.price),
      imageUrl: item.product.images ? item.product.images[0] : null,
      quantity: item.quantity,
      stock: item.product.stock,
      itemSubtotal: Number(itemSubtotal.toFixed(2))
    };
  });

  return {
    storeId,
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    items: formattedItems
  };
}

export async function updateCartItemQuantityService(userId: number, storeId: number, cartItemId: number, quantity: number) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId,
      product: { storeId }
    },
    include: { product: true }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: 'Item removed from cart' };
  }

  if (cartItem.product.stock < quantity) {
    throw new AppError(`Insufficient stock. Available: ${cartItem.product.stock}`, 400);
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: {
      product: {
        select: { id: true, name: true, price: true, images: true, stock: true }
      }
    }
  });
}

export async function removeCartItemService(userId: number, storeId: number, cartItemId: number) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      userId,
      product: { storeId }
    }
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return { message: 'Item removed from cart successfully' };
}

export async function clearCartService(userId: number, storeId: number) {
  const deleted = await prisma.cartItem.deleteMany({
    where: {
      userId,
      product: { storeId }
    }
  });

  return { message: 'Cart cleared successfully', count: deleted.count };
}
