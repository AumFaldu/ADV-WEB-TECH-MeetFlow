"use server";

import { prisma } from "@/app/lib/prisma";
import { requirePermission } from "../lib/auth";

export async function getVenues() {
  await requirePermission("VIEW_VENUE")
  const data = await prisma.venue.findMany({
    orderBy: { VenueID: "desc" },
  });

  return data.map((v) => ({
    id: v.VenueID,
    name: v.VenueName,
    location: v.Location,
  }));
}

export async function addVenue(formData: FormData) {
  await requirePermission("MANAGE_VENUE")
  const name = formData.get("name") as string;
  const location = formData.get("remarks") as string;

  const venue = await prisma.venue.create({
    data: {
      VenueName: name,
      Location: location,
    },
  });

  return {
    id: venue.VenueID,
    name: venue.VenueName,
    location: venue.Location,
  };
}

export async function deleteVenue(id: number) {
  await requirePermission("MANAGE_VENUE")
  await prisma.venue.delete({
    where: { VenueID: id },
  });
}
export async function updateVenue(id: number, formData: FormData) {
  await requirePermission("MANAGE_VENUE")
  return prisma.venue.update({
    where: { VenueID: id },
    data: {
      VenueName: formData.get("name") as string,
      Location: formData.get("remarks") as string,
    },
  });
}

