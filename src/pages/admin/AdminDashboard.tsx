import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Store, Package, TrendingUp, CheckCircle, XCircle, Trash2, Ban, Unlock, AlertTriangle } from 'lucide-react';
import { getExpiryStatus, isSlowMoving } from '@/types';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const {
    users, shops, products,
    approveShop, deleteShop,
    blockUser, unblockUser, deleteUser,
    deleteProduct,
  } = useStore();

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalShops: shops.length,
    approvedShops: shops.filter(s => s.isApproved).length,
    pendingShops: shops.filter(s => !s.isApproved).length,
    totalProducts: products.length,
    expiredProducts: products.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length,
    slowMoving: products.filter(p => isSlowMoving(p)).length,
  }), [users, shops, products]);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary' },
    { label: 'Total Shops', value: stats.totalShops, icon: Store, color: 'text-safe' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-warning' },
    { label: 'Pending Shops', value: stats.pendingShops, icon: AlertTriangle, color: 'text-destructive' },
  ];

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>

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

      <Tabs defaultValue="shops">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Shops Tab */}
        <TabsContent value="shops" className="space-y-3 mt-4">
          {shops.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shops yet</p>
          ) : (
            shops.map(shop => (
              <Card key={shop.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.category} • {shop.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={shop.isApproved ? 'default' : 'secondary'}>
                        {shop.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {products.filter(p => p.shopId === shop.id).length} products
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!shop.isApproved && (
                      <Button size="sm" onClick={() => { approveShop(shop.id); toast.success('Shop approved'); }}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { deleteShop(shop.id); toast.success('Shop deleted'); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-3 mt-4">
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registered users yet</p>
          ) : (
            users.map(user => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                      {user.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isBlocked ? (
                      <Button size="sm" variant="outline" onClick={() => { unblockUser(user.id); toast.success('User unblocked'); }}>
                        <Unlock className="h-4 w-4 mr-1" /> Unblock
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => { blockUser(user.id); toast.success('User blocked'); }}>
                        <Ban className="h-4 w-4 mr-1" /> Block
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { deleteUser(user.id); toast.success('User deleted'); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="destructive">{stats.expiredProducts} expired</Badge>
            <Badge variant="secondary">{stats.slowMoving} slow-moving</Badge>
          </div>
          {products.filter(p => getExpiryStatus(p.expiryDate) === 'expired' || isSlowMoving(p)).map(p => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {shops.find(s => s.id === p.shopId)?.name || 'Unknown shop'} • ₹{p.price}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {getExpiryStatus(p.expiryDate) === 'expired' && <Badge variant="destructive">Expired</Badge>}
                    {isSlowMoving(p) && <Badge variant="secondary">Slow Moving</Badge>}
                  </div>
                </div>
                <Button size="sm" variant="destructive" onClick={() => { deleteProduct(p.id); toast.success('Product removed'); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {products.filter(p => getExpiryStatus(p.expiryDate) === 'expired' || isSlowMoving(p)).length === 0 && (
            <p className="text-center text-muted-foreground py-8">All products are healthy ✅</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
