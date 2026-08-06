import MapViewer from "@/components/MapViewer";
import { I18nProvider } from "@/components/i18n";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <I18nProvider>
        <MapViewer />
      </I18nProvider>
    </main>
  );
}
