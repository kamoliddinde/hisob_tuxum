import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Egg, Package, TrendingDown, TrendingUp, Plus, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface InventorySectionProps {
  totalEggs: number;
  soldEggs: number;
  remainingEggs: number;
  todayIncome: number;
  todayOutcome: number;
  onAddInventory: (amount: number) => void;
  salesHistory: Array<{
    id: string;
    eggs: number;
    amount: number;
    date: string;
    time: string;
  }>;
}

export function InventorySection({
  totalEggs,
  soldEggs,
  remainingEggs,
  todayIncome,
  todayOutcome,
  onAddInventory,
  salesHistory
}: InventorySectionProps) {
  const [newInventory, setNewInventory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddInventory = () => {
    const amount = parseFloat(newInventory) || 0;
    if (amount > 0) {
      onAddInventory(amount);
      setNewInventory("");
      setShowAddForm(false);
    }
  };

  // Prepare chart data from last 5 sales
  const chartData = salesHistory.slice(0, 5).reverse().map((sale, index) => ({
    name: sale.time,
    tuxum: sale.eggs,
  }));

  // Calculate stock percentage
  const stockPercentage = totalEggs > 0 ? (remainingEggs / totalEggs) * 100 : 0;
  const isLowStock = stockPercentage < 20 && stockPercentage > 0;
  const isOutOfStock = remainingEggs === 0;

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Package className="size-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white">Ombor bo'limi</h3>
            <p className="text-sm text-amber-100">Inventar boshqaruvi</p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl h-10 backdrop-blur-sm"
          >
            <Plus className="size-4 mr-1" />
            Qo'shish
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5 bg-white">
        {/* Low Stock Warning */}
        {isLowStock && (
          <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="size-5" />
              <p className="text-sm">Ogohlantirish: Tuxum qoldig'i kam!</p>
            </div>
          </div>
        )}

        {/* Out of Stock Warning */}
        {isOutOfStock && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="size-5" />
              <p className="text-sm">Ombor bo'sh! Yangi tuxum qo'shing.</p>
            </div>
          </div>
        )}

        {/* Add Inventory Form */}
        {showAddForm && (
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 space-y-4 shadow-inner">
            <Label className="text-gray-900">Ombor qo'shish</Label>
            <Input
              type="number"
              placeholder="Tuxum sonini kiriting"
              value={newInventory}
              onChange={(e) => setNewInventory(e.target.value)}
              className="h-12 border-amber-300 rounded-xl"
            />
            <div className="flex gap-3">
              <Button onClick={handleAddInventory} className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 h-12 rounded-xl shadow-lg">
                Qo'shish
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="h-12 rounded-xl border-2">
                Bekor qilish
              </Button>
            </div>
          </div>
        )}

        {/* Total Eggs - Large Display */}
        <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-3">
            <Package className="size-6 text-white" />
            <p className="text-sm text-amber-100">Jami tuxum</p>
          </div>
          <p className="text-white">{totalEggs.toLocaleString()} dona</p>
          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 rounded-full"
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sold Eggs */}
          <div className="p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="size-4 text-red-600" />
              <p className="text-xs text-red-700">Sotilgan</p>
            </div>
            <p className="text-red-900">{soldEggs.toLocaleString()}</p>
          </div>

          {/* Remaining Eggs */}
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Egg className="size-4 text-green-600" />
              <p className="text-xs text-green-700">Qolgan</p>
            </div>
            <p className="text-green-900">{remainingEggs.toLocaleString()}</p>
          </div>

          {/* Today Income */}
          <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-blue-600" />
              <p className="text-xs text-blue-700">Bugungi kirim</p>
            </div>
            <p className="text-blue-900">{todayIncome.toLocaleString()}</p>
          </div>

          {/* Today Outcome */}
          <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="size-4 text-purple-600" />
              <p className="text-xs text-purple-700">Bugungi chiqim</p>
            </div>
            <p className="text-purple-900">{todayOutcome.toLocaleString()}</p>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-5 text-gray-700" />
              <p className="text-sm text-gray-900">Savdo grafigi</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '13px',
                    padding: '8px 12px'
                  }}
                />
                <Bar dataKey="tuxum" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f59e0b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertTriangle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
