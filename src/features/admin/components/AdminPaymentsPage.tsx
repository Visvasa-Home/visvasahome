import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Download, DollarSign, Percent, AlertCircle, CheckCircle, Clock, Ban, RefreshCw } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';

interface AdminPaymentsPageProps {
  onBack: () => void;
}

interface PaymentTransaction {
  id: string;
  bookingId: string;
  customerName: string;
  providerName: string;
  amount: number;
  commissionRate: number;
  platformFee: number;
  payoutAmount: number;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  payoutStatus: 'paid' | 'held' | 'pending';
  date: string;
  method: string;
}

export function AdminPaymentsPage({ onBack }: AdminPaymentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [globalCommission, setGlobalCommission] = useState(15);
  const [showInvoiceId, setShowInvoiceId] = useState<string | null>(null);

  // Mock Payments Database state with localStorage sync
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('visvasahome_transactions');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'TXN89234', bookingId: 'BK10247', customerName: 'Rajesh Kumar', providerName: 'Amit Sharma', amount: 499, commissionRate: 15, platformFee: 74.85, payoutAmount: 424.15, status: 'success', payoutStatus: 'paid', date: '2026-05-12', method: 'UPI (GPay)' },
      { id: 'TXN89235', bookingId: 'BK10246', customerName: 'Priya Singh', providerName: 'Meera Patel', amount: 2499, commissionRate: 15, platformFee: 374.85, payoutAmount: 2124.15, status: 'success', payoutStatus: 'pending', date: '2026-05-12', method: 'Credit Card' },
      { id: 'TXN89236', bookingId: 'BK10245', customerName: 'Arjun Verma', providerName: 'Ravi Kumar', amount: 599, commissionRate: 15, platformFee: 89.85, payoutAmount: 509.15, status: 'pending', payoutStatus: 'pending', date: '2026-05-13', method: 'UPI (PhonePe)' },
      { id: 'TXN89237', bookingId: 'BK10244', customerName: 'Sneha Reddy', providerName: 'Ravi Kumar', amount: 349, commissionRate: 12, platformFee: 41.88, payoutAmount: 307.12, status: 'success', payoutStatus: 'paid', date: '2026-05-11', method: 'Netbanking' },
      { id: 'TXN89238', bookingId: 'BK10243', customerName: 'Vikram Joshi', providerName: 'Suresh Yadav', amount: 2999, commissionRate: 15, platformFee: 449.85, payoutAmount: 2549.15, status: 'failed', payoutStatus: 'pending', date: '2026-05-11', method: 'UPI (Paytm)' },
      { id: 'TXN89239', bookingId: 'BK10242', customerName: 'Neha Mehta', providerName: 'Meera Patel', amount: 899, commissionRate: 15, platformFee: 134.85, payoutAmount: 764.15, status: 'success', payoutStatus: 'held', date: '2026-05-10', method: 'UPI' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('visvasahome_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleRefund = (id: string) => {
    if (window.confirm(`Are you sure you want to process a full refund for Transaction ${id}?`)) {
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, status: 'refunded', payoutStatus: 'held' } : t))
      );
    }
  };

  const togglePayoutHold = (id: string) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newStatus = t.payoutStatus === 'held' ? 'pending' : 'held';
          return { ...t, payoutStatus: newStatus };
        }
        return t;
      })
    );
  };

  const handleApplyGlobalCommission = () => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.status === 'pending') {
          const fee = Number(((t.amount * globalCommission) / 100).toFixed(2));
          return {
            ...t,
            commissionRate: globalCommission,
            platformFee: fee,
            payoutAmount: t.amount - fee
          };
        }
        return t;
      })
    );
    alert(`Global commission rate updated to ${globalCommission}% for all upcoming & pending payouts.`);
  };

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Success</Badge>;
      case 'pending':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
    }
  };

  const getPayoutBadge = (payout: PaymentTransaction['payoutStatus']) => {
    switch (payout) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Released</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'held':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Ban className="w-3 h-3" /> Held</Badge>;
    }
  };

  const filteredTxns = transactions.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.providerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedInvoice = transactions.find(t => t.id === showInvoiceId);

  const downloadCSV = () => {
    const headers = ['Transaction ID,Booking ID,Customer,Provider,Amount,Platform Fee,Payout Amount,Status,Payout Status,Date,Method\n'];
    const rows = filteredTxns.map(t =>
      `${t.id},${t.bookingId},${t.customerName},${t.providerName},₹${t.amount},₹${t.platformFee},₹${t.payoutAmount},${t.status},${t.payoutStatus},${t.date},${t.method}`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top sticky bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
            <p className="text-sm text-gray-500">Track payouts, process refunds, and manage commission rates</p>
          </div>
          <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search ID, customer, worker..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {['all', 'success', 'pending', 'refunded', 'failed'].map(status => (
              <Button
                key={status}
                onClick={() => setStatusFilter(status)}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="capitalize text-xs py-1 h-8 px-3 rounded-full"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Commission Configuration Slider & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1 border-blue-100 bg-gradient-to-br from-white to-blue-50/20">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Commission Engine</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Set the platform commission rate deducted from service bookings.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Platform Rate</span>
                <span className="text-lg font-bold text-blue-600">{globalCommission}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={globalCommission}
                onChange={e => setGlobalCommission(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <Button onClick={handleApplyGlobalCommission} className="w-full bg-[#2563EB] hover:bg-blue-700 text-sm">
                Apply Commission Rate
              </Button>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Gross Revenue</p>
              <p className="text-xl font-bold text-gray-900">₹7,344</p>
              <span className="text-[10px] text-green-600">+12% this week</span>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Platform Cut</p>
              <p className="text-xl font-bold text-blue-600">₹1,126</p>
              <span className="text-[10px] text-gray-400">Avg 14.8% rate</span>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Paid to Partners</p>
              <p className="text-xl font-bold text-green-600">₹6,218</p>
              <span className="text-[10px] text-green-600">Released payouts</span>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Held Payouts</p>
              <p className="text-xl font-bold text-red-600">₹899</p>
              <span className="text-[10px] text-red-500">1 partner block</span>
            </div>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="overflow-hidden border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Comm. Fee</th>
                  <th className="py-3 px-4">Payout</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Payout Hold</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">No transactions found matching the filter.</td>
                  </tr>
                ) : (
                  filteredTxns.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">{t.id}</span>
                        <span className="text-xs text-gray-400">{t.date} via {t.method}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{t.customerName}</td>
                      <td className="py-3 px-4 text-gray-700">{t.providerName}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">₹{t.amount}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">₹{t.platformFee} ({t.commissionRate}%)</td>
                      <td className="py-3 px-4 font-semibold text-green-600">₹{t.payoutAmount}</td>
                      <td className="py-3 px-4">{getStatusBadge(t.status)}</td>
                      <td className="py-3 px-4">{getPayoutBadge(t.payoutStatus)}</td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowInvoiceId(t.id)}
                          className="h-8 text-xs"
                        >
                          Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={t.payoutStatus === 'paid'}
                          onClick={() => togglePayoutHold(t.id)}
                          className={`h-8 text-xs ${t.payoutStatus === 'held' ? 'border-red-300 text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-600'}`}
                        >
                          {t.payoutStatus === 'held' ? 'Release' : 'Hold'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={t.status === 'refunded' || t.status === 'failed'}
                          onClick={() => handleRefund(t.id)}
                          className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
                        >
                          Refund
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Invoice Generator Modal */}
      {showInvoiceId && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setShowInvoiceId(null)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              &times; Close
            </button>
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">INVOICE</h3>
                  <p className="text-xs text-gray-500">Transaction ID: {selectedInvoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">VisvasaHome</p>
                  <p className="text-[10px] text-gray-400">Jaipur, Rajasthan, IN</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="grid grid-cols-2 border-b border-gray-100 py-1.5">
                <span className="text-gray-500">Billing Date:</span>
                <span className="font-medium text-right">{selectedInvoice.date}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 py-1.5">
                <span className="text-gray-500">Billed To:</span>
                <span className="font-medium text-right">{selectedInvoice.customerName}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 py-1.5">
                <span className="text-gray-500">Service Partner:</span>
                <span className="font-medium text-right">{selectedInvoice.providerName}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 py-1.5">
                <span className="text-gray-500">Payment Gateway:</span>
                <span className="font-medium text-right">{selectedInvoice.method}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Gross Job Amount</span>
                  <span>₹{selectedInvoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Platform Fee ({selectedInvoice.commissionRate}%)</span>
                  <span>- ₹{selectedInvoice.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Partner Payout</span>
                  <span>₹{selectedInvoice.payoutAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => { alert('Downloading PDF Invoice...'); setShowInvoiceId(null); }} className="flex-1 bg-[#2563EB] text-white">
                Download PDF
              </Button>
              <Button onClick={() => setShowInvoiceId(null)} variant="outline" className="flex-1">
                Close Preview
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
