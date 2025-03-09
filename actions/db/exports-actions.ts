/*
<ai_context>
Contains server actions related to exports in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  exportsTable,
  InsertExport,
  SelectExport
} from "@/db/schema/exports-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"

export async function createExportAction(
  data: InsertExport
): Promise<ActionState<SelectExport>> {
  try {
    const [newExport] = await db.insert(exportsTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Export created successfully",
      data: newExport
    }
  } catch (error) {
    console.error("Error creating export:", error)
    return { isSuccess: false, message: "Failed to create export" }
  }
}

export async function getExportsByProjectIdAction(
  projectId: string
): Promise<ActionState<SelectExport[]>> {
  try {
    const exports = await db.query.exports.findMany({
      where: eq(exportsTable.projectId, projectId)
    })

    return {
      isSuccess: true,
      message: "Exports retrieved successfully",
      data: exports
    }
  } catch (error) {
    console.error("Error getting exports by project id:", error)
    return { isSuccess: false, message: "Failed to get exports" }
  }
}

export async function getExportByIdAction(
  id: string
): Promise<ActionState<SelectExport>> {
  try {
    const exportRecord = await db.query.exports.findFirst({
      where: eq(exportsTable.id, id)
    })

    if (!exportRecord) {
      return { isSuccess: false, message: "Export not found" }
    }

    return {
      isSuccess: true,
      message: "Export retrieved successfully",
      data: exportRecord
    }
  } catch (error) {
    console.error("Error getting export by id:", error)
    return { isSuccess: false, message: "Failed to get export" }
  }
}

export async function updateExportAction(
  id: string,
  data: Partial<InsertExport>
): Promise<ActionState<SelectExport>> {
  try {
    const [updatedExport] = await db
      .update(exportsTable)
      .set(data)
      .where(eq(exportsTable.id, id))
      .returning()

    if (!updatedExport) {
      return { isSuccess: false, message: "Export not found to update" }
    }

    return {
      isSuccess: true,
      message: "Export updated successfully",
      data: updatedExport
    }
  } catch (error) {
    console.error("Error updating export:", error)
    return { isSuccess: false, message: "Failed to update export" }
  }
}

export async function deleteExportAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(exportsTable).where(eq(exportsTable.id, id))
    return {
      isSuccess: true,
      message: "Export deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting export:", error)
    return { isSuccess: false, message: "Failed to delete export" }
  }
}
