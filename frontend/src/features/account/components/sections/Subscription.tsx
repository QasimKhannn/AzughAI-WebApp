import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import PeekCarousel from "@/pages/azugh/components/PeekCarousel";

type SubscriptionPlan = {
	name: string;
	price: string;
	period: string;
	image: string;
	features: string[];
};

const subscriptionPlans: SubscriptionPlan[] = [
	{
		name: "Basic",
		price: "$7.95",
		period: "/month",
		image: "/assets/sub-1.png",
		features: [
			"Everyday AI outfit recommendations(10 curated search/month)",
			"Pinterest outfits curation",
			"Travel outfit curation (3 curated searches per month)",
			"Style evolution tracking",
			"AI-Personalized lookbook",
		],
	},
	{
		name: "Plus",
		price: "$15.95",
		period: "/month",
		image: "/assets/sub-2.png",
		features: [
			"Unlimited everyday AI outfit recommendations",
			"Pinterest outfits curation",
			"Travel outfit curation (15 curated searches 1 trip/Month)",
			"Style evolution tracking",
			"AI-Personalized lookbook",
		],
	},
	{
		name: "Premium",
		price: "$29.95",
		period: "/month",
		image: "/assets/sub-3.png",
		features: [
			"Unlimited AI outfit recommendations",
			"Pinterest outfits curation",
			"Unlimited travel outfit curation",
			"Style evolution tracking",
			"AI-Personalized lookbook",
			"Unlimited occasion-based styling",
		],
	},
	{
		name: "ONE-TIME TRAVEL STYLING",
		price: "$5.95",
		period: "/trip",
		image: "/assets/sub-4.png",
		features: [
			"Pinterest outfits curation",
			"Travel outfit curation (6 curated searches)",
			"Shopping assistance (brand links)",
			"Style evolution tracking",
			"Multi-destination travel wardrobe curation (only for the trip purchased)",
		],
	},
];

interface SubscriptionSectionProps {
	onBack: () => void;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ onBack }) => {
	const isMobile = useIsMobile();
	const [current, setCurrent] = useState(0);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
	const [carouselDimensions, setCarouselDimensions] = useState(() => computeCarouselDimensions());
	const [manageOpen, setManageOpen] = useState(false);
	const [manageView, setManageView] = useState<"menu" | "change" | "pause">("menu");
	const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
	const [showConfirmChange, setShowConfirmChange] = useState(false);
	const [showConfirmPause, setShowConfirmPause] = useState(false);
	const [currentPlanName, setCurrentPlanName] = useState(subscriptionPlans[0].name);
	const [isPaused, setIsPaused] = useState(false);

	const currentPlanDetails = subscriptionPlans.find((plan) => plan.name === currentPlanName) ?? subscriptionPlans[0];
	const currentPlanPrice = parseFloat(currentPlanDetails.price.replace(/[^0-9.]/g, "")) || 0;

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleResize = () => setCarouselDimensions(computeCarouselDimensions());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleSubscribe = (plan: SubscriptionPlan) => {
		setSelectedPlan(plan);
		setShowPaymentModal(true);
	};

	const closeModal = () => {
		setShowPaymentModal(false);
		setSelectedPlan(null);
	};

	const renderPlanCard = (plan: SubscriptionPlan) => (
		<div className="bg-white border border-gray-300 rounded-2xl shadow-sm font-manrope flex flex-col w-full h-full max-w-sm">
			<div className="h-20 bg-gray-100 flex items-center justify-center rounded-t-2xl overflow-hidden">
				<img src={plan.image} alt={`${plan.name} plan`} className="h-full w-full object-cover" />
			</div>
			<div className="p-4 flex flex-col flex-1">
				<div className="h-12 flex items-start mb-2">
					<h2 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">{plan.name}</h2>
				</div>
				<div className="flex items-baseline mb-3">
					<span className="text-lg font-bold text-gray-900">{plan.price}</span>
					<span className="text-xs text-gray-600 ml-1">{plan.period}</span>
				</div>
				<div className="border-t border-gray-200 mb-3" />
				<ul className="space-y-1.5 flex-1 overflow-y-auto pr-1">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-start gap-2">
							<Check className="w-3 h-3 text-green-600 mt-0.5" />
							<span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
						</li>
					))}
				</ul>
				<Button
					className="mt-4 w-full rounded-xl lowercase text-sm"
					onClick={() => handleSubscribe(plan)}
				>
					select plan
				</Button>
			</div>
		</div>
	);

	const renderPaymentModal = () => {
		if (!showPaymentModal || !selectedPlan) return null;
		return (
			<div className="fixed inset-0 bg-white z-50 overflow-auto flex flex-col items-center py-6 px-4">
				<div className="w-full max-w-xs sm:max-w-sm mx-auto">
					<div className="flex justify-between items-center mb-3">
						<div>
							<p className="text-xs uppercase text-gray-500">plan selected</p>
							<p className="text-base font-semibold text-gray-900">{selectedPlan.name}</p>
						</div>
						<button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
							<X className="w-6 h-6" />
						</button>
					</div>
					<button className="w-full bg-black text-white rounded-lg py-3 text-center text-base font-semibold font-manrope mb-4">
						Pay with Apple Pay
					</button>
					<div className="flex items-center justify-between mb-4">
						<div className="border-t border-gray-300 w-full" />
						<span className="px-3 text-sm text-gray-500">Or pay using</span>
						<div className="border-t border-gray-300 w-full" />
					</div>
					<div className="grid grid-cols-2 gap-2 mb-4 text-xs font-medium text-gray-600">
						<button className="border border-gray-400 rounded-md py-2">Card</button>
						<button className="border border-gray-300 rounded-md py-2">iDEAL</button>
						<button className="border border-gray-300 rounded-md py-2">SEPA Debit</button>
						<button className="border border-gray-300 rounded-md py-2">Bank</button>
					</div>
					<form className="space-y-4">
						<input type="text" className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm" placeholder="Card number" />
						<div className="grid grid-cols-2 gap-2">
							<input type="text" className="px-3 py-3 border border-gray-300 rounded-lg text-sm" placeholder="MM / YY" />
							<input type="text" className="px-3 py-3 border border-gray-300 rounded-lg text-sm" placeholder="CVC" />
						</div>
						<select className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-700">
							<option>United States</option>
							<option>Germany</option>
							<option>France</option>
						</select>
						<input type="text" placeholder="ZIP" className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm" />
						<div className="flex items-center space-x-2 text-xs">
							<input type="checkbox" className="accent-black" />
							<label className="text-gray-600">Save this card for future payments</label>
						</div>
						<button type="button" disabled className="w-full bg-[#6366F1] text-white py-3 rounded-lg font-semibold text-sm opacity-70 cursor-not-allowed">
							Pay {selectedPlan.price}
						</button>
					</form>
				</div>
			</div>
		);
	};

	const handleConfirmPlanChange = () => {
		if (!pendingPlan) return;
		setCurrentPlanName(pendingPlan.name);
		setPendingPlan(null);
		setShowConfirmChange(false);
		setManageOpen(false);
		setManageView("menu");
	};

	const handleConfirmPause = () => {
		setIsPaused(true);
		setShowConfirmPause(false);
		setManageOpen(false);
		setManageView("menu");
	};

	const renderManageActions = () => (
		<>
			<Dialog
				open={manageOpen}
				onOpenChange={(open) => {
					setManageOpen(open);
					if (!open) {
						setManageView("menu");
					}
				}}
			>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle className="text-lg lowercase">manage my membership</DialogTitle>
						<DialogDescription>
							{manageView === "menu"
								? "Choose how you would like to manage your current plan"
								: manageView === "change"
								? "Switch between plans anytime. Changes are reflected based on billing rules below."
								: "Pause your membership without losing your saved preferences."}
						</DialogDescription>
					</DialogHeader>
					{manageView !== "menu" && (
						<Button
							variant="ghost"
							className="mb-4 w-fit px-2 text-xs lowercase"
							onClick={() => setManageView("menu")}
						>
							← back
						</Button>
					)}
					{manageView === "menu" && (
						<div className="grid gap-4">
							<div className="border border-gray-200 p-4 rounded-xl">
								<p className="text-sm font-semibold mb-1">Change my membership</p>
								<p className="text-xs text-gray-600 mb-3">
									Switch between plan tiers whenever you need a different level of styling support.
								</p>
								<Button className="text-xs lowercase" onClick={() => setManageView("change")}>continue</Button>
							</div>
							<div className="border border-gray-200 p-4 rounded-xl">
								<p className="text-sm font-semibold mb-1">Pause my account</p>
								<p className="text-xs text-gray-600 mb-3">
									Pause billing while keeping all of your outfits, data, and preferences safe.
								</p>
								<Button variant="outline" className="text-xs lowercase" onClick={() => setManageView("pause")}>
									continue
								</Button>
							</div>
						</div>
					)}
					{manageView === "change" && (
						<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
							{subscriptionPlans.map((plan) => {
								const isCurrent = plan.name === currentPlanName;
								const priceValue = parseFloat(plan.price.replace(/[^0-9.]/g, ""));
								const isUpgrade = priceValue > currentPlanPrice;
								return (
									<div key={plan.name} className={`border rounded-xl p-4 ${isCurrent ? "border-black" : "border-gray-200"}`}>
										<div className="flex justify-between items-start gap-4">
											<div>
												<p className="text-base font-semibold">{plan.name}</p>
												<p className="text-sm text-gray-600">{plan.price} {plan.period}</p>
												{isCurrent && <p className="text-xs text-green-600 mt-1">your current plan</p>}
											</div>
											<Button
												size="sm"
												variant={isUpgrade ? "default" : "outline"}
												disabled={isCurrent}
												onClick={() => {
													setPendingPlan(plan);
													setShowConfirmChange(true);
												}}
												className="lowercase"
											>
												{isCurrent ? "active" : isUpgrade ? "upgrade" : "downgrade"}
											</Button>
										</div>
									</div>
								);
							})}
							<p className="text-xs text-gray-600 border-t pt-3">
								Upgrades take effect immediately (prorated as needed). Downgrades take effect at the next billing cycle.
							</p>
						</div>
					)}
					{manageView === "pause" && (
						<div className="space-y-4">
							<p className="text-sm text-gray-700">
								Pausing stops future billing while saving your outfits, lookbooks, and preferences. Resume anytime to pick up where you left off.
							</p>
							<Button className="lowercase" onClick={() => setShowConfirmPause(true)}>
								pause my account
							</Button>
							{isPaused && (
								<div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
									Account paused – no billing until resumed.
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			<Dialog open={showConfirmChange} onOpenChange={setShowConfirmChange}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="text-lg lowercase">confirm plan change</DialogTitle>
						<DialogDescription>
							{pendingPlan
								? `Switch to the ${pendingPlan.name} plan for ${pendingPlan.price}${pendingPlan.period}`
								: "Switch membership plan."}
						</DialogDescription>
					</DialogHeader>
					<p className="text-sm text-gray-700">
						Upgrades apply immediately with a prorated charge. Downgrades start next billing cycle.
					</p>
					<DialogFooter className="mt-4">
						<Button variant="outline" onClick={() => setShowConfirmChange(false)} className="lowercase">
							cancel
						</Button>
						<Button onClick={handleConfirmPlanChange} className="lowercase">
							confirm change
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={showConfirmPause} onOpenChange={setShowConfirmPause}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="text-lg lowercase">pause membership</DialogTitle>
						<DialogDescription>
							Pausing stops future billing while keeping everything saved. Resume anytime.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="mt-4">
						<Button variant="outline" onClick={() => setShowConfirmPause(false)} className="lowercase">
							go back
						</Button>
						<Button onClick={handleConfirmPause} className="lowercase">
							pause now
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);

	if (isMobile) {
		return (
			<>
				<div className="w-full min-h-screen flex flex-col bg-white pb-[20vh] max-w-screen-xl mx-auto overflow-y-auto">
					<div className="flex items-center text-lg px-4 py-4">
						<Button variant="ghost" size="sm" onClick={onBack} className="mr-3 p-2">
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<h1 className="text-2xl text-black font-manrope lowercase tracking-wide">subscriptions</h1>
					</div>
					<div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto">
						<PeekCarousel
							items={subscriptionPlans}
							current={current}
							setCurrent={setCurrent}
							cardWidth={carouselDimensions.cardWidth}
							height={carouselDimensions.height}
							renderItem={(plan) => (
								<div className="flex flex-col w-full h-full">
									{renderPlanCard(plan)}
								</div>
							)}
						/>
						<div className="flex justify-center items-center w-full mt-4 mb-2">
							<div className="flex space-x-2.5 items-center">
								{subscriptionPlans.map((_, idx) => (
									<button key={idx} type="button" className="focus:outline-none" onClick={() => setCurrent(idx)} aria-label={`Go to plan ${idx + 1}`}>
										<span className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${current === idx ? "bg-black" : "bg-gray-300"} inline-block`} />
									</button>
								))}
							</div>
						</div>
						<div className="w-full max-w-md px-6 mt-2">
							<Button
								className="w-full lowercase"
								variant="outline"
								onClick={() => {
									setManageView("menu");
									setManageOpen(true);
								}}
							>
								manage my membership
							</Button>
							{isPaused && (
								<p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2 text-center">
									Account paused – no billing until resumed.
								</p>
							)}
						</div>
					</div>
				</div>
				{renderPaymentModal()}
				{renderManageActions()}
			</>
		);
	}

	return (
			<div className="py-8 px-6">
			<div className="mb-6">
				<h1 className="text-3xl font-manrope lowercase tracking-wide text-black">subscriptions</h1>
				<p className="text-gray-600">Choose a plan that works for your style journey</p>
			</div>
				<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 justify-items-center max-w-5xl mx-auto">
				{subscriptionPlans.map((plan) => (
						<div key={plan.name} className="flex flex-col h-full w-full items-center">
						{renderPlanCard(plan)}
					</div>
				))}
			</div>
				<div className="max-w-md mx-auto mt-6">
					<Button
						className="w-full lowercase"
						variant="outline-dark"
						onClick={() => {
							setManageView("menu");
							setManageOpen(true);
						}}
					>
						manage my membership
					</Button>
					{isPaused && (
						<p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2 text-center">
							Account paused – no billing until resumed.
						</p>
					)}
				</div>
			{renderPaymentModal()}
				{renderManageActions()}
		</div>
	);
};

function computeCarouselDimensions() {
	if (typeof window === "undefined") {
		return { cardWidth: 260, height: 440 };
	}
	const cardWidth = window.innerWidth < 640 ? Math.min(280, window.innerWidth * 0.85) : 280;
	const height = window.innerHeight < 700 ? Math.max(360, window.innerHeight * 0.65) : 500;
	return { cardWidth, height };
}

export default SubscriptionSection;
