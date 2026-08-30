import { sendEmailNotification, getOrderShippedEmail, getOrderDeliveredEmail } from './email-service';

export interface Order {
  id: string;
  orderNo: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'apple_pay';
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  totalPrice: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
  carrier?: string;
}

const ORDERS_STORAGE_KEY = 'orders';

export function getAllOrders(): Order[] {
  const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
  return orders ? JSON.parse(orders) : [];
}

export function getOrderById(orderId: string): Order | null {
  const orders = getAllOrders();
  return orders.find((order) => order.id === orderId) || null;
}

export function getUserOrders(email: string): Order[] {
  const orders = getAllOrders();
  return orders.filter((order) => order.email === email);
}

export function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered',
  additionalData?: Partial<Order>,
): Order | null {
  const orders = getAllOrders();
  const index = orders.findIndex((order) => order.id === orderId);

  if (index === -1) {
    return null;
  }

  const order = orders[index];
  const updatedOrder: Order = {
    ...order,
    status,
    updatedAt: new Date().toISOString(),
    ...additionalData,
  };

  orders[index] = updatedOrder;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

  // Send appropriate email notification based on status
  if (status === 'shipped') {
    sendEmailNotification(getOrderShippedEmail(updatedOrder, additionalData?.trackingNumber, additionalData?.carrier));
  } else if (status === 'delivered') {
    sendEmailNotification(getOrderDeliveredEmail(updatedOrder));
  }

  return updatedOrder;
}

export function createOrder(orderData: Omit<Order, 'updatedAt'>): Order {
  const orders = getAllOrders();

  const order: Order = {
    ...orderData,
    updatedAt: new Date().toISOString(),
  };

  orders.push(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

  return order;
}

export function deleteOrder(orderId: string): boolean {
  const orders = getAllOrders();
  const filteredOrders = orders.filter((order) => order.id !== orderId);

  if (filteredOrders.length === orders.length) {
    return false; // Order not found
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filteredOrders));
  return true;
}

export function getOrderStatistics() {
  const orders = getAllOrders();

  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length : 0,
    byStatus: {
      pending: orders.filter((o) => o.status === 'pending').length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    },
  };
}
