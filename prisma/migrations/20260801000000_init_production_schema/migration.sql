-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Enums
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'AI_AUDIT_PENDING', 'REVIEW_PENDING', 'REVISION_REQUIRED', 'APPROVED', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'COURSE_AUDIT_COMPLETE', 'REVIEW_ASSIGNED', 'REVIEW_DECISION', 'COMMENT_ADDED', 'QUALITY_ALERT');
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY');
CREATE TYPE "ResourceType" AS ENUM ('PDF_DOCUMENT', 'VIDEO', 'AUDIO_TRANSCRIPT', 'SLIDE_DECK', 'EXTERNAL_LINK', 'CODE_REPOSITORY');

-- Create Tables
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "logoUrl" TEXT,
    "settings" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roles_organizationId_name_key" UNIQUE ("organizationId", "name")
);

CREATE TABLE "permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
    "permissionId" TEXT NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "role_permissions_roleId_permissionId_key" UNIQUE ("roleId", "permissionId")
);

CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "roleId" TEXT NOT NULL REFERENCES "roles"("id"),
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "passwordHash" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "parentId" TEXT REFERENCES "categories"("id") ON DELETE SET NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "categories_organizationId_slug_key" UNIQUE ("organizationId", "slug")
);

CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT DEFAULT '#6366f1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tags_organizationId_slug_key" UNIQUE ("organizationId", "slug")
);

CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "authorId" TEXT NOT NULL REFERENCES "users"("id"),
    "categoryId" TEXT REFERENCES "categories"("id") ON DELETE SET NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "targetAudience" TEXT,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "overallScore" DOUBLE PRECISION,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "courses_organizationId_slug_key" UNIQUE ("organizationId", "slug")
);

CREATE TABLE "course_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "tagId" TEXT NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "course_tags_courseId_tagId_key" UNIQUE ("courseId", "tagId")
);

CREATE TABLE "modules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL REFERENCES "modules"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "transcript" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "embedding" vector(1536),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "duplicate_matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceLessonId" TEXT NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "targetLessonId" TEXT NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "similarity" DOUBLE PRECISION NOT NULL,
    "matchedExcerpt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "dueDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timeLimitMinutes" INTEGER,
    "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 70.0,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL REFERENCES "quizzes"("id") ON DELETE CASCADE,
    "questionText" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "points" INTEGER NOT NULL DEFAULT 1,
    "options" JSONB NOT NULL,
    "explanation" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "ai_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "qualityScore" DOUBLE PRECISION NOT NULL,
    "clarityScore" DOUBLE PRECISION NOT NULL,
    "bloomsCoverage" JSONB NOT NULL,
    "pedagogyIssues" JSONB NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "reviewerId" TEXT NOT NULL REFERENCES "users"("id"),
    "status" "CourseStatus" NOT NULL,
    "decision" TEXT,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL REFERENCES "reviews"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "users"("id"),
    "lessonId" TEXT REFERENCES "lessons"("id") ON DELETE SET NULL,
    "parentId" TEXT REFERENCES "comments"("id") ON DELETE CASCADE,
    "lineNumber" INTEGER,
    "comment" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "createdById" TEXT NOT NULL REFERENCES "users"("id"),
    "versionNumber" INTEGER NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "changelog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "versions_courseId_versionNumber_key" UNIQUE ("courseId", "versionNumber")
);

CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "userId" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "actorId" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "targetResource" TEXT NOT NULL,
    "changes" JSONB,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploadedById" TEXT NOT NULL REFERENCES "users"("id"),
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "quality_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "organizations"("id") ON DELETE CASCADE,
    "ruleName" TEXT NOT NULL,
    "description" TEXT,
    "minScore" DOUBLE PRECISION NOT NULL DEFAULT 75.0,
    "maxDuplicatePct" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance tuning
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");
CREATE INDEX "courses_organizationId_status_idx" ON "courses"("organizationId", "status");
CREATE INDEX "courses_authorId_idx" ON "courses"("authorId");
CREATE INDEX "courses_categoryId_idx" ON "courses"("categoryId");
CREATE INDEX "modules_courseId_orderIndex_idx" ON "modules"("courseId", "orderIndex");
CREATE INDEX "lessons_moduleId_orderIndex_idx" ON "lessons"("moduleId", "orderIndex");
CREATE INDEX "resources_lessonId_idx" ON "resources"("lessonId");
CREATE INDEX "assignments_lessonId_idx" ON "assignments"("lessonId");
CREATE INDEX "quizzes_lessonId_idx" ON "quizzes"("lessonId");
CREATE INDEX "questions_quizId_orderIndex_idx" ON "questions"("quizId", "orderIndex");
CREATE INDEX "ai_reports_courseId_idx" ON "ai_reports"("courseId");
CREATE INDEX "reviews_courseId_idx" ON "reviews"("courseId");
CREATE INDEX "comments_reviewId_idx" ON "comments"("reviewId");
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");
CREATE INDEX "activity_logs_organizationId_createdAt_idx" ON "activity_logs"("organizationId", "createdAt");
CREATE INDEX "audit_logs_organizationId_createdAt_idx" ON "audit_logs"("organizationId", "createdAt");
CREATE INDEX "attachments_entityType_entityId_idx" ON "attachments"("entityType", "entityId");
