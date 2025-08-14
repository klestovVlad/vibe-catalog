"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } =
    useCartStore();

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <Button variant="outline" size="sm" className="relative">
        <ShoppingCart className="w-4 h-4 mr-2" />
        Cart
      </Button>
    );
  }

  return (
    <>
      {/* Cart button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Cart
        {totalItems > 0 && (
          <Badge variant="secondary" className="ml-2">
            {totalItems}
          </Badge>
        )}
      </Button>

      {/* Cart sidebar */}
      {isOpen && (
        <>
          {/* Background overlay - separate from sidebar */}
          <div
            style={{
              position: "fixed",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 99,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Cart sidebar */}
          <div className="fixed right-0 top-4 h-[calc(100vh-2rem)] w-96 bg-background shadow-lg rounded-l-lg z-[100]">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-lg">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
