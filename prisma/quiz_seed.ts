import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. JSON 파일 읽기
  const dataPath = path.join(__dirname, "data", "quiz_data.json");
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  const quizData = JSON.parse(fileContent);

  // 2. dimensions 데이터 삽입
  for (const dim of quizData.dimensions) {
    await prisma.dimensions.upsert({
      where: { name: dim.name },
      update: {},
      create: dim,
    });
  }
  console.log("Dimensions seeded.");

  // 3. personality_profiles 데이터 삽입
  for (const profile of quizData.profiles) {
    await prisma.personality_profiles.upsert({
      where: { id: profile.id },
      update: {
        name_ko: profile.name_ko,
        name_en: profile.name_en,
        description_ko: profile.description_ko,
        description_en: profile.description_en,
        updated_at: new Date(), // 추가
      },
      create: {
        ...profile,
        updated_at: new Date(), // 추가
        created_at: new Date(), // (created_at도 명시적으로 넣는 것이 안전)
      },
    });
  }
  console.log("Personality profiles seeded.");

  // 4. 퀴즈 질문 및 선택지 데이터 삽입
  await prisma.$transaction(
    quizData.questions.map((q: any) =>
      prisma.quiz_questions.upsert({
        where: { question_code: q.question_code },
        update: {},
        create: {
          question_code: q.question_code,
          quiz_set_id: q.quiz_set_id,
          content_ko: q.content_ko,
          content_en: q.content_en,
          dimension: {
            connect: { name: q.dimension },
          },
          choices: {
            create: q.choices.map((c: any) => ({
              label: c.label,
              content_ko: c.content_ko,
              content_en: c.content_en,
            })),
          },
        },
      })
    )
  );
  console.log("Quiz questions and choices seeded.");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
