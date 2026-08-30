import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { id, name, desc, notes, roast, size, price, image, category, badge } = req.body;

      const product = await prisma.product.create({
        data: {
          id,
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
      return res.status(201).json(product);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
