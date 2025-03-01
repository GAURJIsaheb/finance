/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		colors: {
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  chart: {
			"1": "hsl(var(--chart-1))",
			"2": "hsl(var(--chart-2))",
			"3": "hsl(var(--chart-3))",
			"4": "hsl(var(--chart-4))",
			"5": "hsl(var(--chart-5))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		animation: {
		  "fade-in": "fadeIn 1s ease-in-out",
		  "glitch": "glitch 1.5s infinite alternate",
		  "flicker": "flicker 1.5s infinite",
		},
		keyframes: {
		  fadeIn: {
			"0%": { opacity: 0 },
			"100%": { opacity: 1 },
		  },
		  glitch: {
			"0%": { transform: "translateX(0)" },
			"20%": { transform: "translateX(-5px)" },
			"40%": { transform: "translateX(5px)" },
			"60%": { transform: "translateX(-3px)" },
			"80%": { transform: "translateX(3px)" },
			"100%": { transform: "translateX(0)" },
		  },
		  flicker: {
			"0%, 100%": { opacity: 1 },
			"50%": { opacity: 0.5 },
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  