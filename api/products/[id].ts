import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    if (req.method === 'GET') {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const { name, desc, notes, roast, size, price, image, category, badge } = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          desc,
          notes,
          roast,
          size,
          price: parseFloat(price),
          image,
          category,
          badge: badge || null,
        },
      });
      return res.status(200).json(product);
    }

    if (req.method === 'DELETE') {
      await prisma.product.delete({ where: { id } });
      return res.status(200).json({ message: 'Product deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
