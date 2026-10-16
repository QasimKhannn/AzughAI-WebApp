/**
 * Adds a product to the user's ASOS cart.
 * Must execute in a www.asos.com tab (same-origin) due to CORS.
 * If called from localhost it will always fail (CORS preflight).
 * 
 * Run strategies:
 *  - Paste function into DevTools Console on an ASOS product page.
 *  - Use a userscript / browser extension content script.
 *  - Use a bookmarklet that calls addToAsosCart.
 * 
 * Example:
 *   await addToAsosCart(209300364, "eyJ..."); // token only
 */

export async function addToAsosCart(variantId: number, authToken: string): Promise<boolean> {
  // Same-origin guard
  if (location.hostname !== "www.asos.com") {
    console.warn("[ASOS] Function must run in a www.asos.com tab. Current host:", location.hostname);
    return false;
  }

  // Helper: safely get a value from localStorage (left in case you want to use it later)
  const get = (key: string): string | null => {
    const v = localStorage.getItem(key);
    return v ? v.replace(/(^"|"$)/g, "") : null;
  };

  const bagId = "bdb5e4c7-9f34-4cd3-b906-977c143e1d30"

  // Build the request URL
  const url = `https://www.asos.com/api/commerce/bag/v4/bags/${bagId}/product?expand=summary,total&lang=en-GB`;

  // Hard-coded cURL/fetch headers (exclude only the authorization token)
  const headers: Record<string, string> = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-GB,en;q=0.9",
    "asos-bag-origin": "EUN",
    "asos-bag-session-token": "17:2#476159647#13=805438866",
    "asos-c-ismobile": "false",
    "asos-c-istablet": "false",
    "asos-c-name": "Asos.Commerce.Bag.Sdk",
    "asos-c-plat": "Web",
    "asos-c-store": "COM",
    "asos-c-ver": "9.0.0",
    "asos-cid": "ec0c7a2b-0543-4675-bc18-1e8c56bdc67e",
    "authorization": `Bearer ${authToken}`, // only token is provided at runtime
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "x-requested-with": "XMLHttpRequest",
    // minimal cookie fragment; adjust or expand as needed
    "cookie": "BagId:COM:GB=bdb5e4c7-9f34-4cd3-b906-977c143e1d30; asos-bag-session-token=17:2#476159647#13=805438866; asosbasket=basketitemcount=2&basketitemtotalretailprice=67",
    // optional referer from example request
    "referer": "https://www.asos.com/the-north-face/the-north-face-glacier-100-1-4-zip-fleece-in-black/prd/209300353",
  };

  const body = JSON.stringify({ variantId });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
      credentials: "include",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[ASOS] Add to cart failed:", response.status, errText);
      return false;
    }

    console.log(`[ASOS] ✅ Added variant ${variantId} to bag.`);
    return true;
  } catch (err) {
    console.error("[ASOS] Fetch error:", err);
    return false;
  }
}
// Bookmarklet idea (copy, replace TOKEN):
// javascript:(async()=>{await (window as any).addToAsosCart(209300364,"TOKEN");})();
