const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedWorkStyles() {
  console.log('시작: work_styles 데이터 시드');

  // 1. work_styles 데이터 삽입
  const workStyles = [
    { id: 1, name_ko: "빠른템포", name_en: "FastPaced" },
    { id: 2, name_ko: "활기찬", name_en: "Energetic" },
    { id: 3, name_ko: "차분한환경", name_en: "CalmEnvironment" },
    { id: 4, name_ko: "주도적인", name_en: "Proactive" },
    { id: 5, name_ko: "꼼꼼한", name_en: "DetailOriented" },
    { id: 6, name_ko: "절차준수", name_en: "FollowsProcedures" },
    { id: 7, name_ko: "멀티태스킹", name_en: "Multitasking" },
    { id: 8, name_ko: "한가지에집중", name_en: "Focused" },
    { id: 9, name_ko: "팀워크중시", name_en: "TeamPlayer" },
    { id: 10, name_ko: "독립적인업무", name_en: "IndependentWork" },
    { id: 11, name_ko: "친절한응대", name_en: "FriendlyService" },
    { id: 12, name_ko: "적극적인소통", name_en: "ActiveCommunication" }
  ];

  for (const style of workStyles) {
    await prisma.work_styles.upsert({
      where: { id: style.id },
      update: style,
      create: style
    });
    console.log(`work_style 삽입 완료: ${style.name_ko} (${style.name_en})`);
  }

  // 2. personality_work_style_weights 데이터 삽입
  // quiz_logic.md의 가중치 테이블을 기반으로 매핑
  const personalityWeights = [
    // 액션 히어로 (personality_id: 1)
    { personality_id: 1, work_style_id: 1, weight: 2 },   // 빠른템포: +2
    { personality_id: 1, work_style_id: 2, weight: 2 },   // 활기찬: +2
    { personality_id: 1, work_style_id: 3, weight: -2 },  // 차분한환경: -2
    { personality_id: 1, work_style_id: 4, weight: 1 },   // 주도적인: +1
    { personality_id: 1, work_style_id: 5, weight: -1 },  // 꼼꼼한: -1
    { personality_id: 1, work_style_id: 6, weight: 0 },   // 절차준수: 0
    { personality_id: 1, work_style_id: 7, weight: 2 },   // 멀티태스킹: +2
    { personality_id: 1, work_style_id: 8, weight: -1 },  // 한가지에집중: -1
    { personality_id: 1, work_style_id: 9, weight: 1 },   // 팀워크중시: +1
    { personality_id: 1, work_style_id: 10, weight: 0 },  // 독립적인업무: 0
    { personality_id: 1, work_style_id: 11, weight: 1 },  // 친절한응대: +1
    { personality_id: 1, work_style_id: 12, weight: 1 },  // 적극적인소통: +1

    // 안정적인 전문가 (personality_id: 2)
    { personality_id: 2, work_style_id: 1, weight: -2 },  // 빠른템포: -2
    { personality_id: 2, work_style_id: 2, weight: -1 },  // 활기찬: -1
    { personality_id: 2, work_style_id: 3, weight: 2 },   // 차분한환경: +2
    { personality_id: 2, work_style_id: 4, weight: 0 },   // 주도적인: 0
    { personality_id: 2, work_style_id: 5, weight: 2 },   // 꼼꼼한: +2
    { personality_id: 2, work_style_id: 6, weight: 2 },   // 절차준수: +2
    { personality_id: 2, work_style_id: 7, weight: -1 },  // 멀티태스킹: -1
    { personality_id: 2, work_style_id: 8, weight: 2 },   // 한가지에집중: +2
    { personality_id: 2, work_style_id: 9, weight: 0 },   // 팀워크중시: 0
    { personality_id: 2, work_style_id: 10, weight: 1 },  // 독립적인업무: +1
    { personality_id: 2, work_style_id: 11, weight: 0 },  // 친절한응대: 0
    { personality_id: 2, work_style_id: 12, weight: 0 },  // 적극적인소통: 0

    // 공감형 코디네이터 (personality_id: 3)
    { personality_id: 3, work_style_id: 1, weight: 0 },   // 빠른템포: 0
    { personality_id: 3, work_style_id: 2, weight: 1 },   // 활기찬: +1
    { personality_id: 3, work_style_id: 3, weight: 1 },   // 차분한환경: +1
    { personality_id: 3, work_style_id: 4, weight: 0 },   // 주도적인: 0
    { personality_id: 3, work_style_id: 5, weight: 0 },   // 꼼꼼한: 0
    { personality_id: 3, work_style_id: 6, weight: 0 },   // 절차준수: 0
    { personality_id: 3, work_style_id: 7, weight: 1 },   // 멀티태스킹: +1
    { personality_id: 3, work_style_id: 8, weight: 0 },   // 한가지에집중: 0
    { personality_id: 3, work_style_id: 9, weight: 2 },   // 팀워크중시: +2
    { personality_id: 3, work_style_id: 10, weight: -1 }, // 독립적인업무: -1
    { personality_id: 3, work_style_id: 11, weight: 2 },  // 친절한응대: +2
    { personality_id: 3, work_style_id: 12, weight: 2 },  // 적극적인소통: +2

    // 독립적인 해결사 (personality_id: 4)
    { personality_id: 4, work_style_id: 1, weight: 1 },   // 빠른템포: +1
    { personality_id: 4, work_style_id: 2, weight: 0 },   // 활기찬: 0
    { personality_id: 4, work_style_id: 3, weight: 0 },   // 차분한환경: 0
    { personality_id: 4, work_style_id: 4, weight: 2 },   // 주도적인: +2
    { personality_id: 4, work_style_id: 5, weight: 1 },   // 꼼꼼한: +1
    { personality_id: 4, work_style_id: 6, weight: -1 },  // 절차준수: -1
    { personality_id: 4, work_style_id: 7, weight: 0 },   // 멀티태스킹: 0
    { personality_id: 4, work_style_id: 8, weight: 1 },   // 한가지에집중: +1
    { personality_id: 4, work_style_id: 9, weight: -2 },  // 팀워크중시: -2
    { personality_id: 4, work_style_id: 10, weight: 2 },  // 독립적인업무: +2
    { personality_id: 4, work_style_id: 11, weight: 0 },  // 친절한응대: 0
    { personality_id: 4, work_style_id: 12, weight: 0 },  // 적극적인소통: 0

    // 유연한 만능형 (personality_id: 5)
    { personality_id: 5, work_style_id: 1, weight: 1 },   // 빠른템포: +1
    { personality_id: 5, work_style_id: 2, weight: 1 },   // 활기찬: +1
    { personality_id: 5, work_style_id: 3, weight: 0 },   // 차분한환경: 0
    { personality_id: 5, work_style_id: 4, weight: 0 },   // 주도적인: 0
    { personality_id: 5, work_style_id: 5, weight: 0 },   // 꼼꼼한: 0
    { personality_id: 5, work_style_id: 6, weight: 0 },   // 절차준수: 0
    { personality_id: 5, work_style_id: 7, weight: 1 },   // 멀티태스킹: +1
    { personality_id: 5, work_style_id: 8, weight: 0 },   // 한가지에집중: 0
    { personality_id: 5, work_style_id: 9, weight: 1 },   // 팀워크중시: +1
    { personality_id: 5, work_style_id: 10, weight: 0 },  // 독립적인업무: 0
    { personality_id: 5, work_style_id: 11, weight: 1 },  // 친절한응대: +1
    { personality_id: 5, work_style_id: 12, weight: 1 },  // 적극적인소통: +1
  ];

  for (const weight of personalityWeights) {
    await prisma.personality_work_style_weights.upsert({
      where: {
        personality_id_work_style_id: {
          personality_id: weight.personality_id,
          work_style_id: weight.work_style_id
        }
      },
      update: { weight: weight.weight },
      create: weight
    });
  }

  console.log('personality-work_style 가중치 데이터 삽입 완료');
  console.log('work_styles 시드 완료!');
}

async function main() {
  try {
    await seedWorkStyles();
  } catch (error) {
    console.error('시드 실행 중 에러:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });