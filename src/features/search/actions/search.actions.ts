"use server";

import { auth } from "@/lib/auth";
import { SearchService } from "../services/search.service";

export async function globalSearchAction(query: string, entityType: string = "ALL") {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return { success: false, error: "Unauthorized access." };
  }

  const searchData = await SearchService.globalSearch(
    query,
    entityType,
    session.user.organizationId
  );

  return { success: true, data: searchData };
}
