import React, { useEffect, useState } from 'react';
import { Fish, Package, TrendingUp, AlertTriangle, Calculator, ShoppingCart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useSettings } from '@/lib/settingsContext';
import { Image } from '@/components/ui/image';

const categoryLabels = {
  starter_fingerlings: 'Starter Fingerlings',
  standard_growout: 'Standard Grow-out',
  advance_stocker: 'Advance Stocker',
  jumbo_stocker: 'Jumbo Stocker'
};

const defaultImages = {
  starter_fingerlings: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/f10074aee_generated_image.png',
  standard_growout: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/1749e5533_generated_image.png',
  advance_stocker: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/7ef824960_generated_image.png',
  jumbo_stocker: 'https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/7ef824960_generated_image.png'
};

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { settings } = useSettings();

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50)
      .then(records => {
        setProducts(records?.filter(p => p.active) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const calculatePrice = (product, qty) => {
    if (!product?.tier_pricing || product.tier_pricing.length === 0) {
      return (product?.base_price || 0) * qty;
    }
    const sorted = [...product.tier_pricing].sort((a, b) => a.min_quantity - b.min_quantity);
    let pricePerUnit = product.base_price;
    for (const tier of sorted) {
      if (qty >= tier.min_quantity) pricePerUnit = tier.price_per_unit;
    }
    return pricePerUnit * qty;
  };

  const getUnitPrice = (product, qty) => {
    if (!product?.tier_pricing || product.tier_pricing.length === 0) return product?.base_price || 0;
    const sorted = [...product.tier_pricing].sort((a, b) => a.min_quantity - b.min_quantity);
    let pricePerUnit = product.base_price;
    for (const tier of sorted) {
      if (qty >= tier.min_quantity) pricePerUnit = tier.price_per_unit;
    }
    return pricePerUnit;
  };

  const getStockStatus = (product) => {
    if (product.stock_count <= 0) return { label: 'Out of Stock', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' };
    if (product.stock_count <= (product.low_stock_threshold || 50)) return { label: 'Low Stock', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <img src="https://media.base44.com/images/public/6aa5c999e92256d6cdf3ef15/1749e5533_generated_image.png" alt="Catalog" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Fish className="w-12 h-12 text-cyan-400 mb-3" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Fingerling Catalog</h1>
          <p className="text-slate-200 max-w-xl">Premium Clarias batrachus fingerlings and stockers with tiered pricing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No products available at this time. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map(product => {
              const img = product.images?.[0] || defaultImages[product.category];
              const stock = getStockStatus(product);
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image src={img} alt={product.name} className="w-full h-full" fittingType="fill" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                        {categoryLabels[product.category] || product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{product.name}</h3>
                    {product.size_label && <p className="text-sm text-blue-600 dark:text-cyan-400 mb-2">{product.size_label}</p>}
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{product.description}</p>

                    {/* Tier Pricing */}
                    {product.tier_pricing && product.tier_pricing.length > 0 ? (
                      <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> Tier Pricing
                        </p>
                        <div className="space-y-1">
                          {[...product.tier_pricing].sort((a, b) => a.min_quantity - b.min_quantity).map((tier, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-slate-500 dark:text-slate-400">{tier.min_quantity}+ pcs</span>
                              <span className="font-semibold text-blue-600 dark:text-cyan-400">₱{tier.price_per_unit}/pc</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mb-4">₱{product.base_price}<span className="text-sm font-normal text-slate-400">/pc</span></p>
                    )}

                    {/* Stock - placed below pricing to avoid overlap */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${stock.color}`}>
                        {stock.label === 'Low Stock' && <AlertTriangle className="w-3 h-3" />}
                        {stock.label}
                      </span>
                      <span className="text-xs text-slate-400">{product.stock_count} available</span>
                    </div>

                    <button
                      onClick={() => { setSelectedProduct(product); setQuantity(1); }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-4 h-4" /> Calculate Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quantity Calculator Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Calculator className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedProduct.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedProduct.size_label || categoryLabels[selectedProduct.category]}</p>
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity (pieces)</label>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 10))}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >−</button>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-center font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 10)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >+</button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 dark:text-slate-300">Unit Price</span>
                <span className="font-semibold text-slate-900 dark:text-white">₱{getUnitPrice(selectedProduct, quantity)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-300">Total Price</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-cyan-400">₱{calculatePrice(selectedProduct, quantity).toLocaleString()}</span>
              </div>
            </div>

            <a
              href={`/order?product=${encodeURIComponent(selectedProduct.name)}&qty=${quantity}`}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Place Order Inquiry
            </a>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full mt-2 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >Close</button>
          </div>
        </div>
      )}
    </div>
  );
}