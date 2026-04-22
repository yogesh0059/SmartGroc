import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Package, AlertTriangle, Clock, ShieldCheck, Store } from 'lucide-react';
import { Product, CATEGORIES, getExpiryStatus } from '@/types';
import RushIndicator from '@/features/RushIndicator';
import CreateShopPage from './CreateShopPage';

export default function ShopkeeperDashboard() {
  const { products, getMyShop, getShopProducts } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const myShop = getMyShop();

  if (!myShop) {
    return <CreateShopPage />;
  }

  const shopProducts = getShopProducts(myShop.id);

  const filtered = shopProducts.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && getExpiryStatus(p.expiryDate) !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: shopProducts.length,
    expired: shopProducts.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length,
    nearExpiry: shopProducts.filter(p => ['near-expiry', 'critical'].includes(getExpiryStatus(p.expiryDate))).length,
    safe: shopProducts.filter(p => getExpiryStatus(p.expiryDate) === 'safe').length,
    lowStock: shopProducts.filter(p => p.quantity < 10).length,
  };

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: Package, color: 'text-primary' },
    { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Near Expiry', value: stats.nearExpiry, icon: Clock, color: 'text-warning' },
    { label: 'Safe', value: stats.safe, icon: ShieldCheck, color: 'text-safe' },
  ];

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {/* Shop info */}
      <div className="rounded-xl gradient-hero p-5 text-primary-foreground flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center font-heading font-bold text-xl">
          {myShop.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">{myShop.name}</h1>
          <p className="text-primary-foreground/80 text-sm">{myShop.category} • {myShop.address}</p>
          {!myShop.isApproved && (
            <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full mt-1 inline-block">⏳ Pending Approval</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-2xl font-heading font-bold text-card-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      <RushIndicator />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="near-expiry">Near Expiry</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setEditProduct(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-heading font-medium">No products yet</p>
          <p className="text-sm">Add your first product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onEdit={(product) => { setEditProduct(product); setFormOpen(true); }} />
          ))}
        </div>
      )}

      <ProductForm open={formOpen} onOpenChange={setFormOpen} editProduct={editProduct} shopId={myShop.id} />
    </div>
  );
}
