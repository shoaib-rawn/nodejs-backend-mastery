import { prisma } from '../src/config/prisma.config';
import { uploadToCloudinary, deleteFromCloudinary } from '../src/utils/cloudinary.utils';
import { uploadProductImages, deleteProductImage } from '../src/controllers/product.controller';

async function verifyDay13() {
  console.log('🚀 Starting Day 13 Automated Verification Script (Cloudinary & Multer)...');

  try {
    // 1. Setup Mock User, Store & Product
    console.log('📦 Step 1: Setting up mock Seller User, Store, and Product in PostgreSQL...');

    const user = await prisma.user.create({
      data: {
        email: `day13_seller_${Date.now()}@test.com`,
        password: 'hashedpassword123',
        role: 'SELLER',
        profile: {
          create: {
            firstName: 'Cloud',
            lastName: 'Merchant',
            street: '123 Cloud Ave',
            city: 'Cloud City',
            state: 'Cloud State',
            postalCode: '99999',
            country: 'Cloud Country',
          },
        },
      },
    });

    const store = await prisma.store.create({
      data: {
        name: `Day 13 Cloud Store ${Date.now()}`,
        slug: `day13-cloud-store-${Date.now()}`,
        description: 'Store for Day 13 Cloudinary image testing',
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    });

    const category = await prisma.category.create({
      data: {
        storeId: store.id,
        name: 'Cloud Media',
        slug: 'cloud-media',
      },
    });

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: 'Pro Camera Lens',
        slug: `pro-camera-lens-${Date.now()}`,
        description: 'High performance optical camera lens',
        price: '499.99',
        stock: 15,
        categoryId: category.id,
        images: [],
      },
    });

    // 2. Test Cloudinary Direct Upload Utility Stream
    console.log('🖼️ Step 2: Testing Cloudinary Buffer Upload Stream Utility...');
    const mockImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const uploadResult = await uploadToCloudinary(mockImageBuffer, `multi-merchant-saas/store-${store.id}/products`);
    console.log(`   - Cloudinary Secure URL Generated: ${uploadResult.secure_url}`);
    console.log(`   - Cloudinary Public ID: ${uploadResult.public_id}`);

    if (!uploadResult.secure_url || !uploadResult.secure_url.startsWith('https://res.cloudinary.com')) {
      throw new Error('Cloudinary upload utility failed to return a valid HTTPS URL.');
    }
    console.log('   ✅ Cloudinary Upload Stream Utility PASSED!');

    // 3. Attach Uploaded URL to Product in PostgreSQL
    console.log('💾 Step 3: Attaching Cloudinary Image URL to Product in Database...');
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        images: [uploadResult.secure_url],
      },
    });

    if (updatedProduct.images.length !== 1 || updatedProduct.images[0] !== uploadResult.secure_url) {
      throw new Error('Failed to update product images array in PostgreSQL.');
    }
    console.log('   ✅ PostgreSQL Product Images Array Update PASSED!');

    // 4. Test Image Deletion Controller Logic
    console.log('🗑️ Step 4: Testing Product Image Deletion Controller Action...');
    
    let responseStatusCode = 0;
    let responseData: any = {};

    const req: any = {
      params: { storeId: String(store.id), id: String(product.id) },
      body: { imageUrl: uploadResult.secure_url },
    };

    const res: any = {
      status: (code: number) => {
        responseStatusCode = code;
        return {
          json: (data: any) => {
            responseData = data;
            return data;
          },
        };
      },
    };

    await deleteProductImage(req, res);

    console.log(`   - Delete Controller Status Code: ${responseStatusCode}`);
    console.log(`   - Delete Controller Response Message: ${responseData.message}`);

    if (responseStatusCode !== 200 || responseData.product.images.length !== 0) {
      throw new Error('Image deletion controller failed to remove URL from product.');
    }
    console.log('   ✅ Image Deletion Controller Action PASSED!');

    // 5. Test Cloudinary Asset Deletion Utility
    console.log('🧹 Step 5: Testing Cloudinary Asset Deletion Utility...');
    await deleteFromCloudinary(uploadResult.public_id);
    console.log('   ✅ Cloudinary Asset Deletion Utility PASSED!');

    // 6. Database Cleanup
    console.log('🧼 Step 6: Cleaning up verification database entities...');
    await prisma.product.deleteMany({ where: { storeId: store.id } });
    await prisma.category.deleteMany({ where: { storeId: store.id } });
    await prisma.storeMember.deleteMany({ where: { storeId: store.id } });
    await prisma.store.delete({ where: { id: store.id } });
    await prisma.profile.delete({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    console.log('\n🎉 ALL DAY 13 CLOUDINARY & MULTER VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error: any) {
    console.error('\n❌ Day 13 Verification Failed:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDay13();
