import { prisma } from "@/app/lib/prisma/prisma-singleton";


export async function getPracticalSkills() {
  console.log("getPracticalSkills start");
  
  const practicalSkills = await prisma.practical_skills.findMany({
    select: {
      id: true,
      category_ko: true,
      category_en: true,
      name_ko: true,
      name_en: true
    },
    orderBy: [
      { category_ko: 'asc' },
      { name_ko: 'asc' }
    ]
  });

  return practicalSkills.map((skill: any) => ({
    id: Number(skill.id),
    category_ko: skill.category_ko,
    category_en: skill.category_en,
    name_ko: skill.name_ko,
    name_en: skill.name_en,
  }));
}

// 레거시 호환용 - 기존 getSkills 함수 유지
export async function getSkills() {
  return getPracticalSkills();
}