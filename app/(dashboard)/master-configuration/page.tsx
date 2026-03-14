import { requirePermission } from "./../../lib/auth";
import MasterConfigurationPage from "./MasterConfigurationPage";

export default async function Page() {
  await requirePermission("MANAGE_MASTER");

  return <MasterConfigurationPage />;
}