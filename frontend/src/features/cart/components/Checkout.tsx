import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutProps } from "../types";
import { addToAsosCart } from "../utils/asosCartLoader";

const Checkout = ({
  cartItems,
  cartTotal,
  onClearCart,
  onCheckout,
}: CheckoutProps) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const products = [{ variantId: 209300364 }, { variantId: 208293845 }];
  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkQzMzcyRDIzMEVFRjVGMDYwNzc1MjM5MUJCOTlDODY2RDcyM0RFNDAiLCJ4NXQiOiIwemN0SXc3dlh3WUhkU09SdTVuSVp0Y2oza0EiLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwczovL215LmFzb3MuY29tL3RydXN0IiwibmJmIjoxNzYxMDQxOTI2LCJpYXQiOjE3NjEwNDE5MjYsImV4cCI6MTc2MTEyODMyNiwiYXVkIjoiaHR0cHM6Ly9hcGkuYXNvcy5jb20iLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwic2Vuc2l0aXZlIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbImFub24iXSwiY2xpZW50X2lkIjoid3d3Iiwic3ViIjoiZWY5ODIzNzAyODgyNDU3ZjkzNTg2MDJjNDZhZjk1ZTYiLCJhdXRoX3RpbWUiOjE3NTkyMjc0NzAsImlkcCI6InNpdGUiLCJzaWQiOiI0MDJEQjJBOEE5RjlBRTM1QUVBRUQwQTM1RjY5MDUwQSIsImFpZCI6ImVmOTgyMzcwMjg4MjQ1N2Y5MzU4NjAyYzQ2YWY5NWU2Iiwic2VzcyI6IjJhNzVjZDgwMjJjYjRlYWNiNGFmNDhlNmVjN2VkZDA5Iiwic2hvcCI6ImFzb3MiLCJqdGkiOiIxOURBRjlEQzBDN0VBQUI3QUY1OEY0NTgxOEE3N0VCNCJ9.mhKQTyoyoRuweLV1Hmfy5Qrqiumtsh0azodMiEwmp0n-yACENtuCXL0ZT3iJXjitvia_jDrxjf2_501aAhL7dTF-007FSSU33n_yYN9wHdGa5YpyLMuP1rQ13JV_igQZqgRpXzVLA2wD-QJgEqHRdA0ncQ5kni_Xth4WIuDr1el1ITL28xUMQUfYOoehi_GWV7fZ2k7weHp3JHW2shCKIALxK63gQfdIHPLSbe0rnq9OFwM-7QAt8z1mEWC_m-nNYRvnwpydP5Q8Jzd4LscG0VR8fMxI7VkMUjJol_eV88_LHHXeNYN4O8xa9Ww411a1XKJd7QUadxPygSUEwXa9afAbtOiKBAF8iFkPAnk3m_uD7HBCq6UtzvlEXfN9wozStJVewBtMupgOG3vO_e3yu7z0O3H3b6M66n6iwM949n6KNrfqVVEd3XM58dGpcHIQx6mm5xNRkwLqNaztYRR6kIH-VIkWpO4IbIIecdHt9ZLPdZWfmmAw5k4G3TQ89yBKv0iJXgOmROIrj4LImpGEWnmCXBZkvp5psi5Lpf9wk2Cua4R4WxgcFyu2NjP0FrELq17IaDZ-CVeNOnxr5sPCx4WHppKYcOurfLG3JhB31v2Ld7o_ZrVHCsv2o1mduCT13Yho7PVFBFlrG40NZYSjWuyLYQgkFP2YnL6PNAVXNkE"

  const handleCheckout = async () => {
    for (const p of products) {
      await addToAsosCart(p.variantId, token);
      await new Promise((res) => setTimeout(res, 2000)); // small delay
      console.log(`Added variant ${p.variantId} to ASOS cart.`);
    }
    onCheckout();
  };

  return (
    <Card className="border-[0.5px] border-black bg-white rounded-none">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-black">
            <span className="text-lg font-medium">Total Items:</span>
            <span className="text-lg">{totalItems}</span>
          </div>

          <div className="flex justify-between items-center text-xl font-medium border-t-[0.5px] border-black pt-4 text-black">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="default"
              className="w-full rounded-full"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={onClearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Checkout;
