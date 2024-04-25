-- CreateEnum
CREATE TYPE "Status" AS ENUM ('attendee', 'speaker');

-- CreateTable
CREATE TABLE "Conference" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "location" STRING NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "creatorId" STRING NOT NULL,
    "description" STRING NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING,
    "password" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bio" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weather" (
    "id" STRING NOT NULL,
    "conferenceId" STRING NOT NULL,
    "temperature" FLOAT8 NOT NULL,
    "description" STRING NOT NULL,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConferenceUser" (
    "id" STRING NOT NULL,
    "conferenceId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "role" "Status" NOT NULL,

    CONSTRAINT "ConferenceUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Weather_conferenceId_key" ON "Weather"("conferenceId");

-- AddForeignKey
ALTER TABLE "Conference" ADD CONSTRAINT "Conference_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weather" ADD CONSTRAINT "Weather_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceUser" ADD CONSTRAINT "ConferenceUser_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConferenceUser" ADD CONSTRAINT "ConferenceUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
