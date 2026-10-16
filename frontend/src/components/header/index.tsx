import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from '@/features/cart/hooks/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useAzughContext } from '@/context';

const AppHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const { logout } = useAuth();
    
    // Get modal state from context if available
    let modalOpen = false;
    try {
        const { modalOpen: contextModalOpen } = useAzughContext();
        modalOpen = contextModalOpen;
    } catch {
        // Context not available, keep modalOpen as false
    }

    // White background pages
    const whiteBgPages = [
        '/closet',
        '/matched-success',
        '/convo-history',
        '/convo-summary',
        '/catalogue',
        '/wishlist',
        '/cart',
        '/subscription',
        '/product', // <-- Add this line
        '/account'
    ];
    const isWhiteBgPage = whiteBgPages.some(path => location.pathname.startsWith(path));
    
    // Use white background and black logo when modal is open OR on white background pages
    const shouldUseWhiteTheme = isWhiteBgPage || modalOpen;

    const menuItems = [
        { name: "home", path: "/home" },
        { name: "new conversation", path: "/home" },
        { name: "conversations history", path: "/convo-history" },
        { name: `cart (${cartCount})`, path: "/cart" },
        { name: "wish list", path: "/wishlist" },
        { name: "closet", path: "/closet" },
        { name: "catalogue", path: "/catalogue" },
        { name: "account", path: "/account" },
        { name: "subscription", path: "/subscription" }
    ];

    // Desktop navigation items
    const leftNavItems = [
        { name: "home", path: "/home" },
        // { name: "new conversation", path: "/home" },
        { name: "conversation history", path: "/convo-history" },
        { name: "wish list", path: "/wishlist" },
        { name: "closet", path: "/closet" },
        { name: "catalogue", path: "/catalogue" }
    ];

    const rightNavItems = [
        { name: "account", path: "/account" },
        { name: `cart (${cartCount})`, path: "/cart" }
    ];

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/auth/login", { replace: true });
    };

    // pick the right logo based on state
    const logoSrc = menuOpen
        ? "/assets/logo-black.svg"
        : (shouldUseWhiteTheme ? "/assets/logo-black.svg" : "/assets/logo.svg");

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-40 flex justify-center items-center h-[12vh] transition-all duration-300
                    ${shouldUseWhiteTheme ? "bg-white" : "bg-transparent"}
                    ${(!menuOpen && shouldUseWhiteTheme) ? "border-b border-black" : ""}
                `}
            >
                {/* Mobile Header */}
                <div className="w-full max-w-md flex justify-between items-center px-6 md:hidden">
                    <Link to="/home">
                        <img
                            src={logoSrc}
                            alt="Azugh Logo"
                            className="h-12 w-12"
                        />
                    </Link>

                    <AnimatePresence mode="wait" initial={false}>
                        {!menuOpen ? (
                            <motion.button
                                key="open"
                                onClick={() => setMenuOpen(true)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img
                                    src={shouldUseWhiteTheme ? "/assets/ham-icon-black.svg" : "/assets/ham-icon.svg"}
                                    alt="Open menu"
                                    className="h-12 w-12"
                                />
                            </motion.button>
                        ) : (
                            <motion.button
                                key="close"
                                onClick={() => setMenuOpen(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img
                                    src="/assets/cancel.svg"
                                    alt="Close menu"
                                    className="h-12 w-12"
                                />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex w-full  justify-between items-center px-10">
                    {/* Left side navigation */}
                    <div className="flex items-center space-x-8">
                        <Link to="/home">
                            <img
                                src={logoSrc}
                                alt="Azugh Logo"
                                className="h-12 w-12"
                            />
                        </Link>
                        <nav className="flex items-center space-x-6">
                            {leftNavItems.map((item) => {
                                const isActive =
                                    location.pathname === item.path ||
                                    (item.path === "/home" && location.pathname.startsWith("/home"));
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`font-light lowercase text-base transition-colors duration-200 relative
                                            ${isActive
                                                ? (shouldUseWhiteTheme
                                                    ? "text-azugh-highlight"
                                                    : "text-azugh-highlight")
                                                : (shouldUseWhiteTheme
                                                    ? "text-gray-900 hover:text-azugh-highlight"
                                                    : "text-white hover:text-azugh-highlight")
                                            }`}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <span
                                                className="absolute left-0 -bottom-1 w-full h-0.5 bg-white rounded"
                                                style={{ content: '""' }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right side navigation */}
                    <nav className="flex items-center space-x-6">
                        {rightNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`font-light text-base transition-colors duration-200 lowercase
                                    ${location.pathname === item.path
                                        ? (shouldUseWhiteTheme ? "text-azugh-highlight" : "text-azugh-highlight") 
                                        : (shouldUseWhiteTheme ? "text-gray-900 hover:text-azugh-highlight" : "text-white hover:text-azugh-highlight")
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            
            {/* Mobile Menu Modal */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 bg-white w-full h-full z-40 flex flex-col items-center justify-center md:hidden"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <motion.nav
                            className="flex flex-col space-y-2 text-3xl font-bold text-gray-900 font-manrope"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.15
                                    }
                                }
                            }}
                        >
                            {menuItems.map((item) => (
                                <motion.div
                                    key={item.name}
                                    variants={{
                                        hidden: { opacity: 0, x: -60 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 80,
                                        mass: 2,
                                        velocity: 0,
                                    }}
                                >
                                    <Link
                                        to={item.path}
                                        className="hover:text-azugh-highlight transition font-light text-2xl"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            {/* Logout option styled as a menu item */}
                            <motion.button
                                key="logout"
                                onClick={handleLogout}
                                className="mt-8 text-2xl lowercase font-light text-red-600 hover:text-red-800 transition font-manrope"
                                variants={{
                                    hidden: { opacity: 0, x: -60 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 80,
                                    mass: 2,
                                    velocity: 0,
                                }}
                                style={{
                                    marginTop: "2rem",
                                    textAlign: "left"
                                }}
                            >
                                Logout
                            </motion.button>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AppHeader;