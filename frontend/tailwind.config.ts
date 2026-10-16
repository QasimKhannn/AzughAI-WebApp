import type { Config } from "tailwindcss";
declare var require: any

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				sidebar: {
					DEFAULT: 'var(--sidebar)',
					foreground: 'var(--sidebar-foreground)',
					primary: 'var(--sidebar-primary)',
					'primary-foreground': 'var(--sidebar-primary-foreground)',
					accent: 'var(--sidebar-accent)',
					'accent-foreground': 'var(--sidebar-accent-foreground)',
					border: 'var(--sidebar-border)',
					ring: 'var(--sidebar-ring)'
				},
				// Keep original Azugh brand colors to maintain compatibility
				azugh: {
					bg: 'hsl(var(--azugh-bg, 0 0% 0% / 0.5))',
					Bright: 'hsl(var(--azugh-bright, 36 33% 94%))',
					'Prim-Light': 'hsl(var(--azugh-prim-light, 36 17% 87%))',
					highlight: 'hsl(var(--azugh-highlight, 48 27% 69%))',
					accent: 'hsl(var(--azugh-accent, 12 34% 23%))',
					text: 'hsl(var(--azugh-text, 0 0% 16%))',
					overlay: 'hsl(var(--azugh-overlay, 120 10% 21%))'
				},
				poster: {
					bg: 'hsl(var(--poster-bg, 120 10% 21%))',
				},
				chat: {
					assistant: 'hsl(var(--chat-assistant, 36 17% 87%))',
					user: 'hsl(var(--chat-user, 36 17% 87%))',
				},
			},
			spacing: {
				'safe': 'env(safe-area-inset-bottom)',
			},
			fontFamily: {
				nanumMyeongjo: ['"Nanum Myeongjo"', 'Times New Roman', 'serif'],
				'nanum-myeongjo': ['"Nanum Myeongjo"', 'Times New Roman', 'serif'],
				'open-sauce': ['"Open Sauce Sans"', 'sans-serif'],
				sans: ['"Open Sauce Sans"', 'sans-serif']
			},
			backdropBlur: {
				xs: '2px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-slow': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fadeIn': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fadeOut': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(-8px)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'scale-up-down-rotate': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'50%': { transform: 'scale(1.05) rotate(180deg)' },
					'100%': { transform: 'scale(1) rotate(360deg)' }
				},
				'scale-up-down': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				'scale-up-down-pulse': {
					'0%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					},
					'30%': {
						transform: 'scale(1.05) rotate(0deg)',
						opacity: '1'
					},
					'70%': {
						transform: 'scale(1.05) rotate(360deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1) rotate(360deg)',
						opacity: '1'
					}
				},
				'listening-wave-stretch': {
					'0%': {
						transform: 'scale(1)',
						opacity: '1',
						filter: 'drop-shadow(0 0 2px #292929)',
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '1',
						filter: 'drop-shadow(0 0 4px #292929)',
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1',
						filter: 'drop-shadow(0 0 2px #292929)',
					},
				},
				'scale-up-forward': {
					'0%': {
						transform: 'scale(1)',
					},
					'100%': {
						transform: 'scale(1.20)',
					},
				},
				'scale-down-forward': {
					'0%': {
						transform: 'scale(1)',
					},
					'100%': {
						transform: 'scale(0.8)',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-in-slow': 'fade-in-slow 1s ease-out',
				'fadeIn': 'fadeIn 0.5s ease-out',
				'fadeOut': 'fadeOut 0.5s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'pulse-subtle': 'pulse-subtle 3s infinite ease-in-out',
				'agent-speaking': 'scale-up-down-pulse 2s infinite ease-in-out',
				'agent-listening': 'scale-up-down 3s infinite ease-in-out',
				'agent-waiting': 'scale-down-forward 0.5s forwards ease-in-out',
				'highlight': 'scale-up-forward 0.2s forwards ease-in-out',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-overlay': 'linear-gradient(to bottom, rgba(31, 31, 31, 0.2), rgba(31, 31, 31, 0.5))',
				'gradient-moody': 'linear-gradient(to bottom, #292929, #303A2F)',
				'luxury-gradient': 'linear-gradient(135deg, #292929, #303A2F)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("tailwindcss-safe-area")
	],
} satisfies Config;
