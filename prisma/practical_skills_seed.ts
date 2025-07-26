import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPracticalSkills() {
  console.log("시작: practical_skills 데이터 시드");

  // practical_skills 데이터 삽입
  const practicalSkillsData = [
    {
      id: 1,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "운전면허",
      name_en: "Driver's License",
    },
    {
      id: 2,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "주류 서빙 자격증 (Smart Serve 등)",
      name_en: "Responsible Beverage Service (Smart Serve, etc.)",
    },
    {
      id: 3,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "식품 취급 자격증 (FoodSafe 등)",
      name_en: "Food Handling Certificate (FoodSafe, etc.)",
    },
    {
      id: 4,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "응급처치/CPR 자격증",
      name_en: "First Aid & CPR Certificate",
    },
    {
      id: 5,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "보안요원 면허",
      name_en: "Security Guard License",
    },
    {
      id: 6,
      category_ko: "면허 및 자격증",
      category_en: "Licenses & Certifications",
      name_ko: "WHMIS 자격증",
      name_en: "WHMIS Certification",
    },
    {
      id: 7,
      category_ko: "기술 및 장비",
      category_en: "Technical & Equipment",
      name_ko: "POS 시스템 사용",
      name_en: "Point of Sale (POS) Proficiency",
    },
    {
      id: 8,
      category_ko: "기술 및 장비",
      category_en: "Technical & Equipment",
      name_ko: "Microsoft Office (Word, Excel)",
      name_en: "Microsoft Office Suite",
    },
    {
      id: 9,
      category_ko: "기술 및 장비",
      category_en: "Technical & Equipment",
      name_ko: "Google Workspace (Docs, Sheets)",
      name_en: "Google Workspace",
    },
    {
      id: 10,
      category_ko: "기술 및 장비",
      category_en: "Technical & Equipment",
      name_ko: "에스프레소 머신 작동",
      name_en: "Espresso Machine Operation",
    },
    {
      id: 11,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "현금 관리",
      name_en: "Cash Handling",
    },
    {
      id: 12,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "재고 관리",
      name_en: "Inventory Management",
    },
    {
      id: 13,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "데이터 입력",
      name_en: "Data Entry",
    },
    {
      id: 14,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "소셜 미디어 관리",
      name_en: "Social Media Management",
    },
    {
      id: 15,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "상품 진열 (머천다이징)",
      name_en: "Visual Merchandising",
    },
    {
      id: 16,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "판매 경험",
      name_en: "Sales Experience",
    },
    {
      id: 17,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "업셀링/추가 판매",
      name_en: "Upselling",
    },
    {
      id: 18,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "음식 준비",
      name_en: "Food Preparation",
    },
    {
      id: 19,
      category_ko: "실무 능력",
      category_en: "Practical Skills",
      name_ko: "알러지/식이 제한 지식",
      name_en: "Dietary Needs Knowledge (Allergies, etc.)",
    },
    {
      id: 20,
      category_ko: "언어 구사",
      category_en: "Languages",
      name_ko: "불어 구사 능력",
      name_en: "French Proficiency",
    },
  ];

  for (const skill of practicalSkillsData) {
    await prisma.practical_skills.upsert({
      where: { id: skill.id },
      update: skill,
      create: skill,
    });
    console.log(`실무능력 삽입 완료: ${skill.name_ko} (${skill.name_en})`);
  }

  console.log("practical_skills 시드 완료!");
}

async function main() {
  try {
    await seedPracticalSkills();
  } catch (error) {
    console.error("시드 실행 중 에러:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
