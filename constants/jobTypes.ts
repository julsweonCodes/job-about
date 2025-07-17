import {
  Server,
  Utensils,
  Truck,
  CreditCard,
  Sparkles,
  User,
  ShoppingCart,
  Car,
  Building,
  Shield,
  Users,
  Coffee,
  ChefHat,
  Package,
  Monitor,
  Warehouse,
  Calculator,
  Megaphone,
  Heart,
  Palette,
  Code,
  Wrench,
  GraduationCap,
  Languages,
  Pill,
  Stethoscope,
  UserCheck,
  Zap,
  WrenchIcon,
  Droplets,
  Building2,
} from "lucide-react";
import { JobType, JobTypeConfig, JOB_CATEGORIES } from "./enums";

// JobType enum을 클라이언트 매핑으로 변환
export const JOB_TYPE_CONFIGS: Record<JobType, JobTypeConfig> = {
  [JobType.SERVER]: {
    id: JobType.SERVER,
    name: "Server",
    category: JOB_CATEGORIES.RESTAURANT,
    icon: Server,
    isCommon: true,
  },
  [JobType.KITCHEN]: {
    id: JobType.KITCHEN,
    name: "Kitchen Help",
    category: JOB_CATEGORIES.RESTAURANT,
    icon: Utensils,
    isCommon: true,
  },
  [JobType.DELIVERY]: {
    id: JobType.DELIVERY,
    name: "Delivery",
    category: JOB_CATEGORIES.SERVICE,
    icon: Truck,
    isCommon: true,
  },
  [JobType.CASHIER]: {
    id: JobType.CASHIER,
    name: "Cashier",
    category: JOB_CATEGORIES.RETAIL,
    icon: CreditCard,
    isCommon: true,
  },
  [JobType.CLEANING]: {
    id: JobType.CLEANING,
    name: "Cleaning",
    category: JOB_CATEGORIES.SERVICE,
    icon: Sparkles,
    isCommon: true,
  },
  [JobType.CUSTOMER_SERVICE]: {
    id: JobType.CUSTOMER_SERVICE,
    name: "Customer Service",
    category: JOB_CATEGORIES.SERVICE,
    icon: User,
    isCommon: true,
  },
  [JobType.SALES]: {
    id: JobType.SALES,
    name: "Sales",
    category: JOB_CATEGORIES.RETAIL,
    icon: ShoppingCart,
    isCommon: true,
  },
  [JobType.DRIVER]: {
    id: JobType.DRIVER,
    name: "Driver",
    category: JOB_CATEGORIES.SERVICE,
    icon: Car,
    isCommon: true,
  },
  [JobType.RECEPTIONIST]: {
    id: JobType.RECEPTIONIST,
    name: "Receptionist",
    category: JOB_CATEGORIES.OFFICE,
    icon: Building,
    isCommon: false,
  },
  [JobType.SECURITY]: {
    id: JobType.SECURITY,
    name: "Security",
    category: JOB_CATEGORIES.SERVICE,
    icon: Shield,
    isCommon: false,
  },
  [JobType.MANAGER]: {
    id: JobType.MANAGER,
    name: "Manager",
    category: JOB_CATEGORIES.OFFICE,
    icon: Users,
    isCommon: false,
  },
  [JobType.BARISTA]: {
    id: JobType.BARISTA,
    name: "Barista",
    category: JOB_CATEGORIES.RESTAURANT,
    icon: Coffee,
    isCommon: true,
  },
  [JobType.CHEF]: {
    id: JobType.CHEF,
    name: "Chef",
    category: JOB_CATEGORIES.RESTAURANT,
    icon: ChefHat,
    isCommon: false,
  },
  [JobType.STOCKER]: {
    id: JobType.STOCKER,
    name: "Stocker",
    category: JOB_CATEGORIES.RETAIL,
    icon: Package,
    isCommon: false,
  },
  [JobType.TECH_SUPPORT]: {
    id: JobType.TECH_SUPPORT,
    name: "Tech Support",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Monitor,
    isCommon: false,
  },
  [JobType.WAREHOUSE]: {
    id: JobType.WAREHOUSE,
    name: "Warehouse",
    category: JOB_CATEGORIES.TRADES,
    icon: Warehouse,
    isCommon: false,
  },
  [JobType.ACCOUNTANT]: {
    id: JobType.ACCOUNTANT,
    name: "Accountant",
    category: JOB_CATEGORIES.OFFICE,
    icon: Calculator,
    isCommon: false,
  },
  [JobType.MARKETING]: {
    id: JobType.MARKETING,
    name: "Marketing",
    category: JOB_CATEGORIES.OFFICE,
    icon: Megaphone,
    isCommon: false,
  },
  [JobType.HR]: {
    id: JobType.HR,
    name: "HR",
    category: JOB_CATEGORIES.OFFICE,
    icon: Heart,
    isCommon: false,
  },
  [JobType.DESIGNER]: {
    id: JobType.DESIGNER,
    name: "Designer",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Palette,
    isCommon: false,
  },
  [JobType.DEVELOPER]: {
    id: JobType.DEVELOPER,
    name: "Developer",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Code,
    isCommon: false,
  },
  [JobType.ENGINEER]: {
    id: JobType.ENGINEER,
    name: "Engineer",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Wrench,
    isCommon: false,
  },
  [JobType.TEACHER]: {
    id: JobType.TEACHER,
    name: "Teacher",
    category: JOB_CATEGORIES.SERVICE,
    icon: GraduationCap,
    isCommon: false,
  },
  [JobType.TRANSLATOR]: {
    id: JobType.TRANSLATOR,
    name: "Translator",
    category: JOB_CATEGORIES.SERVICE,
    icon: Languages,
    isCommon: false,
  },
  [JobType.PHARMACIST]: {
    id: JobType.PHARMACIST,
    name: "Pharmacist",
    category: JOB_CATEGORIES.MEDICAL,
    icon: Pill,
    isCommon: false,
  },
  [JobType.NURSE]: {
    id: JobType.NURSE,
    name: "Nurse",
    category: JOB_CATEGORIES.MEDICAL,
    icon: Stethoscope,
    isCommon: false,
  },
  [JobType.DOCTOR]: {
    id: JobType.DOCTOR,
    name: "Doctor",
    category: JOB_CATEGORIES.MEDICAL,
    icon: UserCheck,
    isCommon: false,
  },
  [JobType.FARMER]: {
    id: JobType.FARMER,
    name: "Farmer",
    category: JOB_CATEGORIES.TRADES,
    icon: Zap,
    isCommon: false,
  },
  [JobType.ELECTRICIAN]: {
    id: JobType.ELECTRICIAN,
    name: "Electrician",
    category: JOB_CATEGORIES.TRADES,
    icon: WrenchIcon,
    isCommon: false,
  },
  [JobType.PLUMBER]: {
    id: JobType.PLUMBER,
    name: "Plumber",
    category: JOB_CATEGORIES.TRADES,
    icon: Droplets,
    isCommon: false,
  },
  [JobType.JANITOR]: {
    id: JobType.JANITOR,
    name: "Janitor",
    category: JOB_CATEGORIES.SERVICE,
    icon: Building2,
    isCommon: false,
  },
};

// 카테고리별로 그룹화된 JobType
export const getJobTypesByCategory = () => {
  const grouped: Record<string, JobTypeConfig[]> = {};

  Object.values(JOB_TYPE_CONFIGS).forEach((config) => {
    if (!grouped[config.category]) {
      grouped[config.category] = [];
    }
    grouped[config.category].push(config);
  });

  return grouped;
};

// 일반적인 JobType만 반환
export const getCommonJobTypes = (): JobTypeConfig[] => {
  return Object.values(JOB_TYPE_CONFIGS).filter((config) => config.isCommon);
};

// 특정 JobType의 설정을 가져오는 헬퍼 함수
export const getJobTypeConfig = (jobType: JobType): JobTypeConfig => {
  return JOB_TYPE_CONFIGS[jobType];
};

// 서버에서 받은 JobType enum 값으로부터 클라이언트 설정을 가져오는 함수
export const getJobTypeConfigFromServer = (serverJobType: string): JobTypeConfig | null => {
  const jobType = Object.values(JobType).find((type) => type === serverJobType);
  if (!jobType) return null;
  return JOB_TYPE_CONFIGS[jobType as JobType];
};
