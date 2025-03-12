"use server"

import {
  getPublishedPostsAction,
  getPublishedPostBySlugAction,
  getPublishedPostsByCategorySlugAction,
  getPublishedPostsByTagAction,
  searchPublishedPostsAction
} from "./blog-posts-actions"

import {
  getCategoriesAction,
  getCategoryBySlugAction
} from "./blog-categories-actions"

// Re-export only the read operations needed for the frontend
export {
  // Blog posts
  getPublishedPostsAction,
  getPublishedPostBySlugAction,
  getPublishedPostsByCategorySlugAction,
  getPublishedPostsByTagAction,
  searchPublishedPostsAction,

  // Categories
  getCategoriesAction,
  getCategoryBySlugAction
}
