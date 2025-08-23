-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nextDeltaToken" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "public"."User"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accessToken_key" ON "public"."Account"("accessToken");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
