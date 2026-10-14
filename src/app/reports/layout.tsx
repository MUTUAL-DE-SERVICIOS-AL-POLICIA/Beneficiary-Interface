export const dynamic = "force-dynamic";

import { getUserContext } from "@/api/auth/context";
import { AlertServer } from "@/components";
import { ReportsProvider } from "@/context";
import { hubPublicUrl } from "@/utils/helpers/urls";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { permissions } = await getUserContext();
  const canDownloadReports = permissions.some(
    (permission) => permission.resource === "reports" && permission.scopes.includes("download"),
  );

  if (!canDownloadReports) {
    return (
      <AlertServer
        color="warning"
        description="No tiene permiso para descargar reportes."
        href={hubPublicUrl("/apphub").toString()}
      />
    );
  }

  return (
    <div className="ml-2 mr-2 my-2">
      <ReportsProvider>
        <section className="flex justify-center md:flex-row flex-wrap gap-1 h-[calc(100vh-135px)]">
          {children}
        </section>
      </ReportsProvider>
    </div>
  );
}
