import { useState, useEffect } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { CalculationSection } from "./components/CalculationSection";
import { CashStatus } from "./components/CashStatus";
import { InventorySection } from "./components/InventorySection";
import { DebtsList } from "./components/DebtsList";
import { toast } from "sonner";

interface SaleRecord {
  id: string;
  eggs: number;
  amount: number;
  date: string;
  time: string;
}

export default function App() {
  const [activeSection, setActiveSection] = useState("savdo");
  const [cash, setCash] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  
  // Inventory state
  const [totalEggs, setTotalEggs] = useState(5000);
  const [soldEggs, setSoldEggs] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);
  const [todayOutcome, setTodayOutcome] = useState(0);
  
  const [debts, setDebts] = useState<Array<{
    id: string;
    customerName: string;
    amount: number;
    date: string;
  }>>([]);

  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
  const [showResetMessage, setShowResetMessage] = useState(false);

  const remainingEggs = totalEggs - soldEggs;

  // Auto-reset when inventory reaches zero
  useEffect(() => {
    if (totalEggs > 0 && remainingEggs <= 0) {
      // Reset all values
      setTotalEggs(0);
      setSoldEggs(0);
      setCash(0);
      setTotalDebt(0);
      setTodayIncome(0);
      setTodayOutcome(0);
      setDebts([]);
      setSalesHistory([]);
      
      // Show reset message
      setShowResetMessage(true);
      toast.error("Tuxum tugadi. Barcha ma'lumotlar yangilandi.", {
        duration: 5000,
      });

      // Hide message after 10 seconds
      setTimeout(() => {
        setShowResetMessage(false);
      }, 10000);
    }
  }, [remainingEggs, totalEggs]);

  const handleSaleComplete = (
    eggCount: number,
    totalAmount: number,
    givenAmount: number,
    difference: number,
    isDifferenceCash: boolean
  ) => {
    // Check if we have enough eggs
    if (eggCount > remainingEggs) {
      toast.error("Omborda yetarli tuxum yo'q!");
      return;
    }

    // Update inventory
    setSoldEggs(prev => prev + eggCount);
    setTodayOutcome(prev => prev + eggCount);

    // Update cash
    setCash(prev => prev + givenAmount);

    if (isDifferenceCash) {
      // Customer paid extra - reduced debt
      setTotalDebt(prev => Math.max(0, prev - difference));
    } else {
      // Customer has debt
      setTotalDebt(prev => prev + difference);
      
      // Add to debts list
      const newDebt = {
        id: Date.now().toString(),
        customerName: `Mijoz ${debts.length + 1}`,
        amount: difference,
        date: new Date().toLocaleDateString('uz-UZ')
      };
      setDebts(prev => [...prev, newDebt]);
    }

    // Add to sales history
    const newSale: SaleRecord = {
      id: Date.now().toString(),
      eggs: eggCount,
      amount: totalAmount,
      date: new Date().toLocaleDateString('uz-UZ'),
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };
    setSalesHistory(prev => [newSale, ...prev].slice(0, 10));

    toast.success("Savdo muvaffaqiyatli amalga oshirildi!");
  };

  const handleAddInventory = (amount: number) => {
    setTotalEggs(prev => prev + amount);
    setTodayIncome(prev => prev + amount);
    toast.success(`${amount.toLocaleString()} dona tuxum omborga qo'shildi!`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-gray-900">Tuxum savdo tizimi</h1>
              <p className="text-gray-600">Zamonaviy boshqaruv paneli</p>
            </div>

            {/* Reset Alert Message */}
            {showResetMessage && (
              <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-red-900">Tuxum tugadi. Barcha ma'lumotlar yangilandi.</h3>
                    <p className="text-sm text-red-700 mt-1">Tizim avtomatik ravishda qayta boshlandi. Yangi tuxum qo'shing.</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Calculation */}
              <div className="xl:col-span-2 space-y-6">
                <CalculationSection onSaleComplete={handleSaleComplete} remainingEggs={remainingEggs} />
                <DebtsList debts={debts} setDebts={setDebts} totalDebt={totalDebt} />
              </div>
              
              {/* Right Column - Status Cards */}
              <div className="space-y-6">
                <CashStatus cash={cash} totalDebt={totalDebt} />
                <InventorySection
                  totalEggs={totalEggs}
                  soldEggs={soldEggs}
                  remainingEggs={remainingEggs}
                  todayIncome={todayIncome}
                  todayOutcome={todayOutcome}
                  onAddInventory={handleAddInventory}
                  salesHistory={salesHistory}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
