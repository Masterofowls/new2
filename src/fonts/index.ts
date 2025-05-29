import {
  Inter,
  Space_Grotesk,
} from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-space-grotesk',
})
