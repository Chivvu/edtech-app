import { prisma } from "@/lib/prisma";

export interface SearchResultItem {
  id: string;
  type: "COURSE" | "LESSON" | "RESOURCE" | "CATEGORY" | "TAG";
  title: string;
  subtitle?: string;
  url: string;
  badge?: string;
}

export interface GlobalSearchResponse {
  results: SearchResultItem[];
  totalMatches: number;
}

export class SearchService {
  static async globalSearch(
    query: string,
    entityType: string = "ALL",
    organizationId: string
  ): Promise<GlobalSearchResponse> {
    if (!query || query.trim().length === 0) {
      return { results: [], totalMatches: 0 };
    }

    const searchTerm = query.trim();
    const results: SearchResultItem[] = [];

    const searchCourses = entityType === "ALL" || entityType === "COURSE";
    const searchLessons = entityType === "ALL" || entityType === "LESSON";
    const searchResources = entityType === "ALL" || entityType === "RESOURCE";
    const searchCategories = entityType === "ALL" || entityType === "CATEGORY";
    const searchTags = entityType === "ALL" || entityType === "TAG";

    const [courses, lessons, resources, categories, tags] = await Promise.all([
      searchCourses
        ? prisma.course.findMany({
            where: {
              organizationId,
              deletedAt: null,
              OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
              ],
            },
            take: 5,
            select: { id: true, title: true, status: true, description: true },
          })
        : [],

      searchLessons
        ? prisma.lesson.findMany({
            where: {
              module: { course: { organizationId } },
              deletedAt: null,
              OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { content: { contains: searchTerm, mode: "insensitive" } },
              ],
            },
            take: 5,
            select: { id: true, title: true, moduleId: true, module: { select: { courseId: true } } },
          })
        : [],

      searchResources
        ? prisma.resource.findMany({
            where: {
              lesson: { module: { course: { organizationId } } },
              deletedAt: null,
              title: { contains: searchTerm, mode: "insensitive" },
            },
            take: 5,
            select: { id: true, title: true, type: true, fileUrl: true, lessonId: true },
          })
        : [],

      searchCategories
        ? prisma.category.findMany({
            where: {
              organizationId,
              deletedAt: null,
              name: { contains: searchTerm, mode: "insensitive" },
            },
            take: 3,
            select: { id: true, name: true, slug: true },
          })
        : [],

      searchTags
        ? prisma.tag.findMany({
            where: {
              organizationId,
              name: { contains: searchTerm, mode: "insensitive" },
            },
            take: 3,
            select: { id: true, name: true, slug: true },
          })
        : [],
    ]);

    // Format Course Results
    courses.forEach((c) => {
      results.push({
        id: c.id,
        type: "COURSE",
        title: c.title,
        subtitle: c.description?.slice(0, 70) || "Course Entity",
        url: `/courses/${c.id}`,
        badge: c.status,
      });
    });

    // Format Lesson Results
    lessons.forEach((l) => {
      results.push({
        id: l.id,
        type: "LESSON",
        title: l.title,
        subtitle: "Curriculum Lesson Content",
        url: `/lessons/${l.id}`,
        badge: "LESSON",
      });
    });

    // Format Resource Results
    resources.forEach((r) => {
      results.push({
        id: r.id,
        type: "RESOURCE",
        title: r.title,
        subtitle: `Attachment File (${r.type})`,
        url: `/lessons/${r.lessonId}`,
        badge: r.type,
      });
    });

    // Format Category Results
    categories.forEach((cat) => {
      results.push({
        id: cat.id,
        type: "CATEGORY",
        title: cat.name,
        subtitle: `Taxonomy Category: /${cat.slug}`,
        url: `/courses?categoryId=${cat.id}`,
        badge: "CATEGORY",
      });
    });

    // Format Tag Results
    tags.forEach((tag) => {
      results.push({
        id: tag.id,
        type: "TAG",
        title: `#${tag.name}`,
        subtitle: "Curriculum Tag Filter",
        url: `/courses?tagId=${tag.id}`,
        badge: "TAG",
      });
    });

    return {
      results,
      totalMatches: results.length,
    };
  }
}
