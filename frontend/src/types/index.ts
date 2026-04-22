export type Category = 'Dairy' | 'Snacks' | 'Household' | 'Beverage' | 'Beauty' | 'Stationery' | 'Fruits' | 'Vegetables';

export type ExpiryStatus = 'safe' | 'near-expiry' | 'critical' | 'expired';

export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice: number;
  costPrice?: number;
  quantity: number;
  expiryDate: string;
  addedDate: string;
  image?: string;
  salesCount?: number;
  lastSoldDate?: string;
  shopId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface CreditCustomer {
  id: string;
  name: string;
  phone?: string;
  balance: number;
  history: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  type: 'credit' | 'payment';
  amount: number;
  description?: string;
  date: string;
}

export interface PurchaseRecord {
  id: string;
  items: { productId: string; productName: string; category: Category; quantity: number; price: number }[];
  total: number;
  date: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  address: string;
  deliveryTime: string;
  rating: number;
  image?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isBlocked: boolean;
}

export const CATEGORIES: Category[] = ['Dairy', 'Snacks', 'Household', 'Beverage', 'Beauty', 'Stationery', 'Fruits', 'Vegetables'];

export const SHOP_CATEGORIES = ['Grocery', 'Dairy', 'Fruits & Vegetables', 'Bakery', 'Organic', 'General Store', 'Supermarket', 'Mini Mart'];

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 3) return 'critical';
  if (daysLeft <= 7) return 'near-expiry';
  return 'safe';
}

export function getDaysLeft(expiryDate: string): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiryPercentage(addedDate: string, expiryDate: string): number {
  const added = new Date(addedDate).getTime();
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  const total = expiry - added;
  const elapsed = now - added;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export function getSmartDiscount(expiryDate: string): number {
  const status = getExpiryStatus(expiryDate);
  switch (status) {
    case 'expired': return 50;
    case 'critical': return 40;
    case 'near-expiry': return 20;
    default: return 0;
  }
}

export function getDiscountedPrice(product: Product): number {
  const discount = getSmartDiscount(product.expiryDate);
  return Math.round(product.originalPrice * (1 - discount / 100));
}

export function getAlternativeProducts(products: Product[], category: Category, excludeId: string): Product[] {
  return products.filter(p => p.category === category && p.id !== excludeId && p.quantity > 0 && getExpiryStatus(p.expiryDate) !== 'expired');
}

export function isSlowMoving(product: Product): boolean {
  if (!product.lastSoldDate) return true;
  const daysSinceSold = Math.ceil((Date.now() - new Date(product.lastSoldDate).getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceSold > 10;
}

export function getProductProfit(product: Product): number {
  const cost = product.costPrice ?? Math.round(product.originalPrice * 0.6);
  return getDiscountedPrice(product) - cost;
}

export function getShelfPriority(product: Product): { priority: 'high' | 'medium' | 'low'; reason: string } {
  const status = getExpiryStatus(product.expiryDate);
  if (status === 'critical' || status === 'near-expiry') return { priority: 'high', reason: 'Expiring soon' };
  if ((product.salesCount ?? 0) > 10) return { priority: 'high', reason: 'High demand' };
  if (isSlowMoving(product)) return { priority: 'medium', reason: 'Slow moving — needs promotion' };
  return { priority: 'low', reason: 'Normal shelf placement' };
}

export function getRushLevel(): { level: 'Low' | 'Medium' | 'High'; color: string } {
  const hour = new Date().getHours();
  if ((hour >= 18 && hour <= 20) || (hour >= 10 && hour <= 12)) return { level: 'High', color: 'text-destructive' };
  if ((hour >= 16 && hour < 18) || (hour >= 12 && hour < 14)) return { level: 'Medium', color: 'text-warning' };
  return { level: 'Low', color: 'text-safe' };
}
