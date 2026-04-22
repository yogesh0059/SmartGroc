import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { getDiscountedPrice } from '@/types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, checkout, cartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Browse products and add items to your cart</p>
        <Link to="/"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Cart</h1>

      <div className="space-y-3">
        {cart.map(item => {
          const price = getDiscountedPrice(item.product);
          return (
            <div key={item.product.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-card-foreground truncate">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="text-sm font-semibold text-primary mt-1">₹{price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { removeFromCart(item.product.id); toast.success('Removed from cart'); }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors ml-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">₹30.00</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-heading font-semibold text-lg">Total</span>
          <span className="font-heading font-bold text-lg text-primary">₹{(cartTotal + 30).toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={() => { checkout(); toast.success('Order placed! 🎉'); }}>
          <ShoppingBag className="h-4 w-4 mr-2" /> Checkout Now
        </Button>
      </div>
    </div>
  );
}
