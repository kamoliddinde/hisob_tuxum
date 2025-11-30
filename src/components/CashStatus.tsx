import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wallet, TrendingUp, AlertCircle, DollarSign } from "lucide-react";

interface CashStatusProps {
  cash: number;
  totalDebt: number;
}

export function CashStatus({ cash, totalDebt }: CashStatusProps) {
  const netCash = cash - totalDebt;

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Wallet className="size-6 text-white" />
          </div>
          <div>
            <h3 className="text-white">Kassa holati</h3>
            <p className="text-sm text-green-100">Moliyaviy ko'rsatkichlar</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4 bg-white">
        {/* Cash */}
        <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-5 text-white" />
            <p className="text-sm text-green-100">Kassadagi pul</p>
          </div>
          <p className="text-white">{cash.toLocaleString()} so'm</p>
        </div>
        
        {/* Total Debt */}
        <div className="p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="size-5 text-white" />
            <p className="text-sm text-orange-100">Jami qarz</p>
          </div>
          <p className="text-white">{totalDebt.toLocaleString()} so'm</p>
        </div>

        {/* Net Cash */}
        <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="size-5 text-white" />
            <p className="text-sm text-blue-100">Sof kassa</p>
          </div>
          <p className="text-white">{netCash.toLocaleString()} so'm</p>
        </div>
      </CardContent>
    </Card>
  );
}
