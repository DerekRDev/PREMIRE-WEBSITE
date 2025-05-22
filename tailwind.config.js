/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#e6f7ff',
  				'100': '#bae7ff',
  				'200': '#91d5ff',
  				'300': '#69c0ff',
  				'400': '#40a9ff',
  				'500': '#1890ff',
  				'600': '#096dd9',
  				'700': '#0050b3',
  				'800': '#003a8c',
  				'900': '#002766',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#f6ffed',
  				'100': '#d9f7be',
  				'200': '#b7eb8f',
  				'300': '#95de64',
  				'400': '#73d13d',
  				'500': '#52c41a',
  				'600': '#389e0d',
  				'700': '#237804',
  				'800': '#135200',
  				'900': '#092b00',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#fff7e6',
  				'100': '#ffe7ba',
  				'200': '#ffd591',
  				'300': '#ffc069',
  				'400': '#ffa940',
  				'500': '#fa8c16',
  				'600': '#d46b08',
  				'700': '#ad4e00',
  				'800': '#873800',
  				'900': '#612500',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			neutral: {
  				'50': '#f5f5f5',
  				'100': '#f0f0f0',
  				'200': '#d9d9d9',
  				'300': '#bfbfbf',
  				'400': '#8c8c8c',
  				'500': '#595959',
  				'600': '#434343',
  				'700': '#262626',
  				'800': '#1f1f1f',
  				'900': '#141414'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI"',
  				'Roboto',
  				'Helvetica Neue"',
  				'Arial',
  				'sans-serif'
  			],
  			serif: [
  				'Georgia',
  				'Cambria',
  				'Times New Roman"',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono"',
  				'Courier New"',
  				'monospace'
  			]
  		},
  		container: {
  			center: true,
  			padding: {
  				DEFAULT: '1rem',
  				sm: '2rem',
  				lg: '4rem',
  				xl: '5rem'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  	},
  	keyframes: {
  			fadeIn: {
  			  '0%': { opacity: '0' },
  			  '100%': { opacity: '1' }
  			},
  			slideUp: {
  			  '0%': { transform: 'translateY(20px)', opacity: '0' },
  			  '100%': { transform: 'translateY(0)', opacity: '1' }
  			},
  			slideInRight: {
  			  '0%': { transform: 'translateX(20px)', opacity: '0' },
  			  '100%': { transform: 'translateX(0)', opacity: '1' }
  			},
  			bounceIn: {
  			  '0%': { transform: 'scale(0.3)', opacity: '0' },
  			  '50%': { transform: 'scale(1.05)' },
  			  '70%': { transform: 'scale(0.9)' },
  			  '100%': { transform: 'scale(1)', opacity: '1' }
  			}
  	},
  	animation: {
  			fadeIn: 'fadeIn 0.3s ease-out',
  			slideUp: 'slideUp 0.4s ease-out',
  			slideInRight: 'slideInRight 0.4s ease-out',
  			bounceIn: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  	}
 }
},
  plugins: [require("tailwindcss-animate")],
}