import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, SortAsc, SortDesc, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentTransaction } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentHistoryProps {
  onBack: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      date: '2024-09-28',
      description: 'subscription renewal - premium plan',
      amount: 19.99,
      status: 'completed',
      paymentMethod: '4532'
    },
    {
      id: '2',
      date: '2024-09-15',
      description: 'personal styling session',
      amount: 89.00,
      status: 'completed',
      paymentMethod: '5123'
    },
    {
      id: '3',
      date: '2024-08-28',
      description: 'subscription renewal - premium plan',
      amount: 19.99,
      status: 'completed',
      paymentMethod: '4532'
    },
    {
      id: '4',
      date: '2024-08-10',
      description: 'wardrobe consultation - virtual',
      amount: 149.00,
      status: 'completed',
      paymentMethod: '4532'
    },
    {
      id: '5',
      date: '2024-07-28',
      description: 'subscription renewal - premium plan',
      amount: 19.99,
      status: 'completed',
      paymentMethod: '4532'
    },
    {
      id: '6',
      date: '2024-07-05',
      description: 'azugh ai premium features',
      amount: 29.99,
      status: 'failed',
      paymentMethod: '5123'
    }
  ]);

  const months = [
    { value: 'all', label: 'all months' },
    { value: '01', label: 'january' },
    { value: '02', label: 'february' },
    { value: '03', label: 'march' },
    { value: '04', label: 'april' },
    { value: '05', label: 'may' },
    { value: '06', label: 'june' },
    { value: '07', label: 'july' },
    { value: '08', label: 'august' },
    { value: '09', label: 'september' },
    { value: '10', label: 'october' },
    { value: '11', label: 'november' },
    { value: '12', label: 'december' }
  ];

  const years = ['2024', '2023', '2022'];

  const filteredAndSortedTransactions = () => {
    let filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear().toString();
      const transactionMonth = (transactionDate.getMonth() + 1).toString().padStart(2, '0');

      const yearMatch = transactionYear === selectedYear;
      const monthMatch = selectedMonth === 'all' || transactionMonth === selectedMonth;

      return yearMatch && monthMatch;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const toggleTransaction = (transactionId: string) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  const getStatusColor = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const processedTransactions = filteredAndSortedTransactions();

  // Mobile layout (existing functionality)
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white pb-[20vh] max-w-screen-xl md:max-w-full mx-auto overflow-y-auto">
        {/* Header */}
        <div className="flex items-center text-lg px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl md:text-2xl text-black font-manrope lowercase tracking-wide">
            payment history
          </h1>
        </div>

        <div className="max-w-md mx-auto w-full px-4 space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border rounded-none">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value} className="font-light">
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year} className="font-light">
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full h-10 font-light"
                    >
                      {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border rounded-none">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground lowercase">
                      transactions
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-light">
                      {processedTransactions.length} {processedTransactions.length === 1 ? 'transaction' : 'transactions'} found
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {processedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-light">no transactions found</p>
                    <p className="text-sm text-muted-foreground font-light">try adjusting your filters</p>
                  </div>
                ) : (
                  processedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div
                        className="border border-border p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => toggleTransaction(transaction.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-foreground font-light text-sm">
                                {formatDate(transaction.date)}
                              </span>
                              <span className="text-foreground font-medium">
                                {formatAmount(transaction.amount)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground font-light">
                              {transaction.description}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center space-x-2">
                            <span className={`text-xs font-light ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                            {expandedTransaction === transaction.id ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {expandedTransaction === transaction.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-border"
                          >
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground font-light">transaction id:</span>
                                <span className="text-foreground font-light">{transaction.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground font-light">payment method:</span>
                                <span className="text-foreground font-light">•••• {transaction.paymentMethod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground font-light">status:</span>
                                <span className={`font-light ${getStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Desktop embedded layout
  return (
    <div className="py-8 max-w-4xl md:max-w-full">
      <div className="mb-3 px-5">
        <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
          Payment History
        </h1>
        <p className="text-gray-600">View and manage your transaction history</p>
      </div>

      <div className="max-w-4xl md:max-w-full border border-black border-l-0">
        {/* Filters and Export */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 rounded-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">Filter Transactions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-light"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value} className="font-light">
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year} className="font-light">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full h-10 font-light"
                  >
                    {sortOrder === 'desc' ? (
                      <>
                        <SortDesc className="mr-2 h-4 w-4" />
                        Newest First
                      </>
                    ) : (
                      <>
                        <SortAsc className="mr-2 h-4 w-4" />
                        Oldest First
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-end">
                  <div className="text-sm text-muted-foreground">
                    {processedTransactions.length} transaction{processedTransactions.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-black rounded-none border-b-0 border-l-0 border-r-0"> 
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-light text-foreground">
                    Transaction History
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete record of your payments and subscriptions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {processedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filter criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {processedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div
                        className="border border-border rounded-lg p-6 cursor-pointer hover:bg-muted/20 transition-colors"
                        onClick={() => toggleTransaction(transaction.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-20 text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm">
                                {transaction.description}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                •••• {transaction.paymentMethod}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-foreground">
                                {formatAmount(transaction.amount)}
                              </div>
                              <div className={`text-xs font-light ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {expandedTransaction === transaction.id ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {expandedTransaction === transaction.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-6 pt-6 border-t border-border"
                          >
                            <div className="grid grid-cols-3 gap-6 text-sm">
                              <div>
                                <label className="text-muted-foreground font-light">Transaction ID</label>
                                <p className="text-foreground font-medium mt-1">{transaction.id}</p>
                              </div>
                              <div>
                                <label className="text-muted-foreground font-light">Payment Method</label>
                                <p className="text-foreground font-medium mt-1">•••• {transaction.paymentMethod}</p>
                              </div>
                              <div>
                                <label className="text-muted-foreground font-light">Status</label>
                                <p className={`font-medium mt-1 ${getStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentHistory;