import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { Skill, WorkStyle } from "@/types/profile";


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

export async function getWorkStyles() {
  console.log("getWorkStyles start");

  const workStyles = await prisma.work_styles.findMany({
    select: {
      id: true,
      name_ko: true,
      name_en: true
    },
    orderBy: [
      { name_en: 'asc' }
    ]
  });

  return workStyles.map((skill: any) => ({
    id: Number(skill.id),
    name_ko: skill.name_ko,
    name_en: skill.name_en,
  }));
}
