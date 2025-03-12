"use server"

import { db } from "@/db/db"
import { categoriesTable, InsertCategory, SelectCategory } from "@/db/schema"
import { ActionState } from "@/types"
import { eq, like } from "drizzle-orm"

export async function createCategoryAction(
  data: InsertCategory
): Promise<ActionState<SelectCategory>> {
  try {
    const [newCategory] = await db
      .insert(categoriesTable)
      .values(data)
      .returning()
    return {
      isSuccess: true,
      message: "Category created successfully",
      data: newCategory
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return { isSuccess: false, message: "Failed to create category" }
  }
}

export async function getCategoriesAction(): Promise<
  ActionState<SelectCategory[]>
> {
  try {
    const categories = await db.query.categories.findMany({
      orderBy: categories => categories.name
    })
    return {
      isSuccess: true,
      message: "Categories retrieved successfully",
      data: categories
    }
  } catch (error) {
    console.error("Error getting categories:", error)
    return { isSuccess: false, message: "Failed to get categories" }
  }
}

export async function getCategoryByIdAction(
  id: string
): Promise<ActionState<SelectCategory>> {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categoriesTable.id, id)
    })

    if (!category) {
      return { isSuccess: false, message: "Category not found" }
    }

    return {
      isSuccess: true,
      message: "Category retrieved successfully",
      data: category
    }
  } catch (error) {
    console.error("Error getting category by id:", error)
    return { isSuccess: false, message: "Failed to get category" }
  }
}

export async function getCategoryBySlugAction(
  slug: string
): Promise<ActionState<SelectCategory>> {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categoriesTable.slug, slug)
    })

    if (!category) {
      return { isSuccess: false, message: "Category not found" }
    }

    return {
      isSuccess: true,
      message: "Category retrieved successfully",
      data: category
    }
  } catch (error) {
    console.error("Error getting category by slug:", error)
    return { isSuccess: false, message: "Failed to get category" }
  }
}

export async function updateCategoryAction(
  id: string,
  data: Partial<InsertCategory>
): Promise<ActionState<SelectCategory>> {
  try {
    const [updatedCategory] = await db
      .update(categoriesTable)
      .set(data)
      .where(eq(categoriesTable.id, id))
      .returning()

    if (!updatedCategory) {
      return { isSuccess: false, message: "Category not found to update" }
    }

    return {
      isSuccess: true,
      message: "Category updated successfully",
      data: updatedCategory
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return { isSuccess: false, message: "Failed to update category" }
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id))
    return {
      isSuccess: true,
      message: "Category deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { isSuccess: false, message: "Failed to delete category" }
  }
}

export async function searchCategoriesAction(
  query: string
): Promise<ActionState<SelectCategory[]>> {
  try {
    const categories = await db.query.categories.findMany({
      where: like(categoriesTable.name, `%${query}%`),
      orderBy: categories => categories.name
    })

    return {
      isSuccess: true,
      message: "Categories search completed successfully",
      data: categories
    }
  } catch (error) {
    console.error("Error searching categories:", error)
    return { isSuccess: false, message: "Failed to search categories" }
  }
}
