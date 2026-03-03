import { Card, CardContent } from "../../components/ui/card";
export default function ValueExchangeChannels() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Value Exchange Channels</h1>
      <p className="mb-6 text-muted-foreground">Enable instant, trustless, and programmable payments—both fiat and crypto, with escrow protection for business transactions.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Web2 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web2: Payments Interface</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Connect Stripe, Paystack, Flutterwave, or digital app wallet</li>
            <li>Full transaction history and invoice downloads</li>
            <li>Settlement and payment notifications</li>
            <li>Fiat on/off-ramp and reporting</li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm">Connect Payment Gateway</button>
          <button className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm">App Wallet</button>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="px-3 py-2 bg-muted text-primary rounded border text-sm"
              onClick={() => window.open("https://moniepoint.com/", "_blank", "noopener")}
            >
              Open Moniepoint
            </button>
          </div>
        </CardContent></Card>
        {/* Web3 */}
        <Card><CardContent className="py-6 px-4">
          <h2 className="text-xl font-semibold mb-2">Web3 Module (StarkNet)</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mb-2">
            <li>Token approval for on-chain stablecoin/crypto payments</li>
            <li>Escrow smart contract for dispute-free settlements</li>
            <li>Programmable, milestone-based release flows</li>
            <li>Borderless payments via StarkNet wallets</li>
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 text-sm"
            onClick={() => window.open("https://starkgate.starknet.io/ethereum/bridge?mode=deposit", "_blank", "noopener")}
          >
            Authorize On-chain Payments
          </button>
          <button
            className="mt-2 ml-2 px-4 py-2 bg-muted text-primary rounded border text-sm"
            onClick={() => window.open("https://starkgate.starknet.io/ethereum/bridge?mode=deposit", "_blank", "noopener")}
          >
            Escrow Settlement
          </button>
        </CardContent></Card>
      </div>
    </div>
  );
}
