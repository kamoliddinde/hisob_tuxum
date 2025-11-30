import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertCircle,
  X,
  CheckCircle,
  Users,
} from "lucide-react";

interface Debt {
  id: string;
  customerName: string;
  amount: number;
  date: string;
}

interface DebtsListProps {
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
  totalDebt: number;
}

export function DebtsList({
  debts,
  setDebts,
  totalDebt,
}: DebtsListProps) {
  const removeDebt = (id: string) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <AlertCircle className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-white">Qarzlar bo'limi</h3>
              <p className="text-sm text-orange-100">
                Qarzdorlar ro'yxati
              </p>
            </div>
          </div>
          <div className="text-right bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-orange-100">Jami qarz</p>
            <p className="text-white">
              {totalDebt.toLocaleString()} so'm
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {debts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <p className="text-gray-900 mb-2">Qarzlar yo'q</p>
            <p className="text-sm text-gray-500">
              Hamma to'lovlar amalga oshirilgan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4 text-gray-600">
              <Users className="size-5" />
              <span className="text-sm">
                Jami {debts.length} ta qarzdor
              </span>
            </div>
            {debts.map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-orange-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-gray-900">
                      {debt.customerName}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 border-orange-200 rounded-lg px-3"
                    >
                      Qarzdor
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {debt.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-orange-700">
                    {debt.amount.toLocaleString()} so'm
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDebt(debt.id)}
                    className="hover:bg-red-100 hover:text-red-700 rounded-xl h-10 w-10 p-0"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}