/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,ts, js}',
    './app/**/*.{ts,tsx,js}',
    './src/**/*.{astro, html, js, jsx, md, mdx, svelte, ts,tsx, vue}',
    './node_modules/@omit/react-confirm-dialog/dist/index.js'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        'font-min':'0.5rem',
        'font-sem':'0.7rem',
        'font-med':'1rem',
        'screen-login':'5rem',
        'h1':'2rem',
        'h2':'1.6rem',
        'h3':'1.2',
        
      },
      backgroundSize: {
        '50':'25%',
      },
      backgroundImage: {
        'custom-image':"url('./assets/_images/saude.png')",
        'custom-gradient':'linear-gradient (to right, #007cf0, #00dfd8)',
      }, 
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['PlayfairDisplay','serif'],
        lato: ['Lato','sans-serif'],
        robotoSlab: ['RobotoSlab','sans-serif'],
        merriweather: ['MerriWeather','sans-serif']
      },
      textColor: {
        'blueColorLoginParagraf':'#008ae1',
        'blueColorLoginTitle':'#1e293b',
        'icone':'#3c4852',
        'input':'#3c4852',
        'thead':'#6e7786',
        'label':'#5d6066',
      },
      backgroundColor:{
        'greenColor':'#617749',
        'cinzaColor':'#282a36',
        'homeBackground':'#e2eff2',
        'form':'#15202b',
        'input':'#192734',
        'thead':'#384152',
        'fieldSet':'#f0f2f5',
      },
      borderColor:{
        'greenColor':'#43650b',
        'greenAcesaColor':'#04a96d',
        'form':'#b0b1b2'
      },
      ringColor:{
        'greenRing':'#617749'
      },
      borderRadius:{
        'form':'6px',
      },
      
    },
  },
  plugins: [require("tailwindcss-animate")],
}