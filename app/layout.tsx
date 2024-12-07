import type { Metadata } from "next";
import { Arvo, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

//👇 Configure our font object
const avro = Arvo({
  subsets: ['latin'],
  weight: [ "400", "700"],
  variable: "--font-avro"
})
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: [ "400", "700"],
  variable: "--font-ibm-plex-sans"
})

export const metadata: Metadata = {
  title: "CoFinance",
  description: "CoFinance is a web APP that helps in tracking your finances!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${avro.variable}`}>
        {children}
      </body>
    </html>
  );
}
