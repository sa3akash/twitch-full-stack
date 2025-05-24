import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
} from "@/lib/constants/seo.constants";
import { APP_URL } from "@/lib/constants/url.constants";
import { getLocale, getMessages } from "next-intl/server";
import { ApolloClientProvider } from "@/providers/ApolloClientProvider";
import { NextIntlClientProvider } from "next-intl";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/providers/theme-provider";


const interFont = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
})


export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
    template: `%s - ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  applicationName: SITE_NAME,
  authors: [
    {
      name: "sa3akash",
      url: new URL("https://github.com/sa3akash"),
    },
  ],
  keywords: SITE_KEYWORDS,
  generator: "Next.js",
  creator: "Shakil Ahmed",
  publisher: "sa3akash",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/touch-icons/256x256.png",
    other: {
      rel: "touch-icons",
      url: "/touch-icons/256x256.png",
      sizes: "256x256",
      type: "image/png",
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    emails: ["sa2avroo@gmail.com"],
    locale: "en_US",
    images: [
      {
        url: "/touch-icons/512x512.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
    url: new URL(APP_URL),
  },
  twitter: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/touch-icons/512x512.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${interFont.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ApolloClientProvider>{children}</ApolloClientProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
