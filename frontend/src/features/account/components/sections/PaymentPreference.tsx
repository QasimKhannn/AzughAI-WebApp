import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Plus, X, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from "sonner";
import { PaymentMethod } from '../types';
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentPreferenceProps {
  onBack: () => void;
}

const PaymentPreference: React.FC<PaymentPreferenceProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardNumber: '4532',
      cardType: 'visa',
      expirationMonth: '12',
      expirationYear: '25',
      isDefault: true
    },
    {
      id: '2',
      cardNumber: '5123',
      cardType: 'mastercard',
      expirationMonth: '08',
      expirationYear: '26',
      isDefault: false
    }
  ]);

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cvv: '',
    expirationMonth: '',
    expirationYear: ''
  });

  const getCardTypeFromNumber = (cardNumber: string): PaymentMethod['cardType'] => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'visa';
  };

  const formatCardNumber = (value: string) => {
    const number = value.replace(/\s/g, '');
    const formatted = number.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cvv || !newCard.expirationMonth || !newCard.expirationYear) {
      toast.error("Please fill in all card details");
      return;
    }

    const cardNumber = newCard.cardNumber.replace(/\s/g, '');
    if (cardNumber.length < 16) {
      toast.error("Please enter a valid card number");
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      cardNumber: cardNumber.slice(-4),
      cardType: getCardTypeFromNumber(cardNumber),
      expirationMonth: newCard.expirationMonth,
      expirationYear: newCard.expirationYear,
      isDefault: paymentMethods.length === 0
    };

    setPaymentMethods(prev => [...prev, newPaymentMethod]);
    setNewCard({ cardNumber: '', cvv: '', expirationMonth: '', expirationYear: '' });
    setShowAddModal(false);
    toast.success("Payment method added successfully!");
  };

  const handleDeleteCard = (cardId: string) => {
    setCardToDelete(cardId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCard = () => {
    if (!cardToDelete) return;

    const cardToRemove = paymentMethods.find(card => card.id === cardToDelete);
    const updatedMethods = paymentMethods.filter(card => card.id !== cardToDelete);

    if (cardToRemove?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }

    setPaymentMethods(updatedMethods);
    setShowDeleteModal(false);
    setCardToDelete(null);
    toast.success("Payment method removed");
  };

  const setAsDefault = (cardId: string) => {
    setPaymentMethods(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
    toast.success("Default payment method updated");
  };

  const getCardIcon = (cardType: PaymentMethod['cardType']) => {
    const iconClass = "h-8 w-8";
    switch (cardType) {
      case 'visa':
        return <div className={`${iconClass} bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold`}>VISA</div>;
      case 'mastercard':
        return <div className={`${iconClass} bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold`}>AMEX</div>;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  // Mobile layout (existing functionality)
  if (isMobile) {
    return (
      <>
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
              payment
            </h1>
          </div>

          <div className="max-w-md mx-auto w-full px-4 space-y-6">
            {/* Payment Methods Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-border rounded-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground lowercase">
                        payment methods
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-light">
                        manage your saved cards
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-light">no payment methods added</p>
                      <p className="text-sm text-muted-foreground font-light">add your first card to get started</p>
                    </div>
                  ) : (
                    paymentMethods.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border border-border p-4 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getCardIcon(card.cardType)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-foreground font-light">•••• {card.cardNumber}</span>
                                {card.isDefault && (
                                  <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-light">
                                    default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground font-light">
                                expires {card.expirationMonth}/{card.expirationYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!card.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAsDefault(card.id)}
                                className="text-xs font-light"
                              >
                                set default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Add Payment Method Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full h-12 bg-primary hover:bg-[#303A2FB2] rounded-full text-white font-light lowercase text-base"
              >
                <Plus className="mr-2 h-4 w-4" />
                add payment method
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Add Card Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground lowercase">
                add payment method
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                  card number
                </Label>
                <Input
                  id="cardNumber"
                  value={newCard.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, '').length <= 16) {
                      setNewCard({ ...newCard, cardNumber: formatted });
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 font-light"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expMonth" className="text-sm font-medium text-foreground">
                    month
                  </Label>
                  <Input
                    id="expMonth"
                    value={newCard.expirationMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 2 && (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12))) {
                        setNewCard({ ...newCard, expirationMonth: value });
                      }
                    }}
                    placeholder="MM"
                    className="mt-1 font-light"
                  />
                </div>
                <div>
                  <Label htmlFor="expYear" className="text-sm font-medium text-foreground">
                    year
                  </Label>
                  <Input
                    id="expYear"
                    value={newCard.expirationYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 2) {
                        setNewCard({ ...newCard, expirationYear: value });
                      }
                    }}
                    placeholder="YY"
                    className="mt-1 font-light"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
                    cvv
                  </Label>
                  <Input
                    id="cvv"
                    value={newCard.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setNewCard({ ...newCard, cvv: value });
                      }
                    }}
                    placeholder="123"
                    className="mt-1 font-light"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleAddCard} className="flex-1 font-light">
                  add card
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 font-light">
                  cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground lowercase">
                remove payment method
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-foreground font-light">
                  are you sure you want to remove this payment method? this action cannot be undone.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={confirmDeleteCard}
                  variant="destructive"
                  className="flex-1 font-light"
                >
                  remove
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 font-light"
                >
                  cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop embedded layout
  return (
    <>
      <div className="py-8 max-w-4xl md:max-w-full">
        <div className="mb-3 px-5">
          <h1 className="text-3xl font-manrope lowercase tracking-wide text-black mb-2">
            Payment Methods
          </h1>
          <p className="text-gray-600">Manage your payment methods and billing information</p>
        </div>

        <div className="max-w-2xl md:max-w-full">
          {/* Payment Methods Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-black rounded-none shadow-none border-l-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-light text-foreground">
                        Saved Payment Methods
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Manage your saved cards and billing information
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 h-10 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No payment methods</h3>
                    <p className="text-muted-foreground mb-6">Add your first payment method to get started</p>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 h-10 rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white font-light lowercase"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                ) : (
                  <div className="grid">
                    {paymentMethods.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border border-black border-l-0 border-b-0 border-r-0 rounded-none p-6 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getCardIcon(card.cardType)}
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="text-foreground font-medium">•••• •••• •••• {card.cardNumber}</span>
                                {card.isDefault && (
                                  <span className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded-full font-light">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Expires {card.expirationMonth}/{card.expirationYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!card.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAsDefault(card.id)}
                                className="font-light"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-none">
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 text-blue-600 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Payment Security</h4>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and securely stored. We never store your full card number or CVV.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Card Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground lowercase">
              add payment method
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                value={newCard.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  if (formatted.replace(/\s/g, '').length <= 16) {
                    setNewCard({ ...newCard, cardNumber: formatted });
                  }
                }}
                placeholder="1234 5678 9012 3456"
                className="mt-1 font-light"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expMonth" className="text-sm font-medium text-foreground">
                  Month
                </Label>
                <Input
                  id="expMonth"
                  value={newCard.expirationMonth}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 2 && (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12))) {
                      setNewCard({ ...newCard, expirationMonth: value });
                    }
                  }}
                  placeholder="MM"
                  className="mt-1 font-light"
                />
              </div>
              <div>
                <Label htmlFor="expYear" className="text-sm font-medium text-foreground">
                  Year
                </Label>
                <Input
                  id="expYear"
                  value={newCard.expirationYear}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 2) {
                      setNewCard({ ...newCard, expirationYear: value });
                    }
                  }}
                  placeholder="YY"
                  className="mt-1 font-light"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-sm font-medium text-foreground">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  value={newCard.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setNewCard({ ...newCard, cvv: value });
                    }
                  }}
                  placeholder="123"
                  className="mt-1 font-light"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button onClick={handleAddCard} className="flex-1 font-light">
                Add Card
              </Button>
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 font-light">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground lowercase">
              Remove Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-foreground font-light">
                Are you sure you want to remove this payment method? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={confirmDeleteCard}
                variant="destructive"
                className="flex-1 font-light"
              >
                Remove
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 font-light"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentPreference;