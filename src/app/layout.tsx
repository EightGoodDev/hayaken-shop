import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { CompareProvider } from "@/components/compare-provider";
import { FavoritesProvider } from "@/components/favorites-provider";
import { PointsProvider } from "@/components/points-provider";
import { PriceProvider } from "@/components/price-provider";
import { OverridesProvider } from "@/components/overrides-provider";
import { CouponsProvider } from "@/components/coupons-provider";
import { StoreChrome } from "@/components/store-chrome";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} ｜ ホームセンター通販`,
    template: `%s ｜ ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} ｜ ホームセンター通販`,
    description: SITE_DESCRIPTION,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} ｜ ホームセンター通販`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#e8631a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <PriceProvider>
         <OverridesProvider>
          <CouponsProvider>
           <PointsProvider>
            <FavoritesProvider>
              <CompareProvider>
                <CartProvider>
                  <StoreChrome>{children}</StoreChrome>
                </CartProvider>
              </CompareProvider>
            </FavoritesProvider>
           </PointsProvider>
          </CouponsProvider>
         </OverridesProvider>
        </PriceProvider>
      </body>
    </html>
  );
}
