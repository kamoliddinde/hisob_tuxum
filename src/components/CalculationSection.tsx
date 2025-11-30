import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calculator, RefreshCw, AlertTriangle } from "lucide-react";

interface CalculationSectionProps {
  onSaleComplete: (
    soldEggs: number,
    totalAmount: number,
    givenAmount: number,
    difference: number,
    isDifferenceCash: boolean
  ) => void;
  remainingEggs: number;
}

export function CalculationSection({ onSaleComplete, remainingEggs }: CalculationSectionProps) {
  const [soldEggs, setSoldEggs] = useState("");
  const [givenAmount, setGivenAmount] = useState("");
  const [eggPrice, setEggPrice] = useState("");
  const [result, setResult] = useState<{
    totalAmount: number;
    debt: number;
    paidFromDebt: number;
    addedToCash: number;
  } | null>(null);

  const calculateSale = () => {
    const eggs = parseFloat(soldEggs) || 0;
    const given = parseFloat(givenAmount) || 0;
    const price = parseFloat(eggPrice) || 0;

    if (eggs <= 0 || price <= 0) {
      return;
    }

    if (eggs > remainingEggs) {
      return;
    }

    const total = eggs * price;
    
    if (total > given) {
      // Customer owes money
      setResult({
        totalAmount: total,
        debt: total - given,
        paidFromDebt: 0,
        addedToCash: given,
      });
      onSaleComplete(eggs, total, given, total - given, false);
    } else {
      // Customer paid extra or exact
      setResult({
        totalAmount: total,
        debt: 0,
        paidFromDebt: given - total,
        addedToCash: total,
      });
      onSaleComplete(eggs, total, given, given - total, true);
    }
  };

  const resetForm = () => {
    setSoldEggs("");
    setGivenAmount("");
    setEggPrice("");
    setResult(null);
  };

  const eggsToSell = parseFloat(soldEggs) || 0;
  const insufficientStock = eggsToSell > remainingEggs;

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Calculator className="size-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">Hisob-kitob bo'limi</h3>
            <p className="text-sm text-blue-100">Savdo hisobini amalga oshiring</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="soldEggs" className="text-gray-700">Sotilgan tuxum soni</Label>
            <Input
              id="soldEggs"
              type="number"
              placeholder="Masalan: 100"
              value={soldEggs}
              onChange={(e) => setSoldEggs(e.target.value)}
              className="h-14 text-lg border-gray-300 rounded-xl"
            />
            {insufficientStock && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertTriangle className="size-4" />
                <span>Omborda faqat {remainingEggs} dona bor</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eggPrice" className="text-gray-700">Tuxum narxi (dona narxi)</Label>
            <Input
              id="eggPrice"
              type="number"
              placeholder="Masalan: 1500"
              value={eggPrice}
              onChange={(e) => setEggPrice(e.target.value)}
              className="h-14 text-lg border-gray-300 rounded-xl"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="givenAmount" className="text-gray-700">Berilgan summa</Label>
            <Input
              id="givenAmount"
              type="number"
              placeholder="Masalan: 150000"
              value={givenAmount}
              onChange={(e) => setGivenAmount(e.target.value)}
              className="h-14 text-lg border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={calculateSale} 
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg"
            disabled={insufficientStock}
          >
            <Calculator className="size-5 mr-2" />
            Hisoblash
          </Button>
          <Button onClick={resetForm} variant="outline" className="h-14 border-2 border-gray-300 rounded-xl hover:bg-gray-50">
            <RefreshCw className="size-5 mr-2" />
            Tozalash
          </Button>
        </div>

        {result && (
          <div className="space-y-4 pt-6 border-t-2 border-gray-100">
            <h4 className="text-gray-900">Natijalar</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Amount */}
              <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white">
                <p className="text-sm text-blue-100 mb-2">Umumiy summa</p>
                <p className="text-white">{result.totalAmount.toLocaleString()} so'm</p>
              </div>

              {/* Added to Cash */}
              <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
                <p className="text-sm text-green-100 mb-2">Kassaga qo'shildi</p>
                <p className="text-white">{result.addedToCash.toLocaleString()} so'm</p>
              </div>
            </div>

            {result.debt > 0 && (
              <div className="p-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg text-white">
                <p className="text-sm text-red-100 mb-2">Qarz</p>
                <p className="text-white">{result.debt.toLocaleString()} so'm</p>
              </div>
            )}
            
            {result.paidFromDebt > 0 && (
              <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg text-white">
                <p className="text-sm text-emerald-100 mb-2">Qarzdan uzildi</p>
                <p className="text-white">{result.paidFromDebt.toLocaleString()} so'm</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
