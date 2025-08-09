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
  Home,
  Briefcase,
  Hammer,
  Leaf,
  Clipboard,
  Type,
  Camera,
  Video,
  Baby,
  PawPrint,
  BookOpen,
  Paintbrush,
} from "lucide-react";
import { fromPrismaJobType } from "@/types/enumMapper";

// 근무 타입
export enum JobType {
  SERVER = "server",
  KITCHEN = "kitchen",
  DELIVERY = "delivery",
  CASHIER = "cashier",
  CLEANING = "cleaning",
  CUSTOMER_SERVICE = "customer_service",
  SALES = "sales",
  DRIVER = "driver",
  RECEPTIONIST = "receptionist",
  SECURITY = "security",
  MANAGER = "manager",
  BARISTA = "barista",
  CHEF = "chef",
  STOCKER = "stocker",
  TECH_SUPPORT = "tech_support",
  WAREHOUSE = "warehouse",
  ACCOUNTANT = "accountant",
  MARKETING = "marketing",
  HR = "hr",
  DESIGNER = "designer",
  DEVELOPER = "developer",
  ENGINEER = "engineer",
  TEACHER = "teacher",
  TRANSLATOR = "translator",
  PHARMACIST = "pharmacist",
  NURSE = "nurse",
  DOCTOR = "doctor",
  FARMER = "farmer",
  ELECTRICIAN = "electrician",
  PLUMBER = "plumber",
  JANITOR = "janitor",
  HOST = "host",
  HOUSEKEEPING = "housekeeping",
  EVENT_STAFF = "event_staff",
  PACKER = "packer",
  CONSTRUCTION_WORKER = "construction_worker",
  MAINTENANCE = "maintenance",
  LANDSCAPER = "landscaper",
  ADMIN_ASSISTANT = "admin_assistant",
  DATA_ENTRY = "data_entry",
  CONTENT_CREATOR = "content_creator",
  PHOTOGRAPHER = "photographer",
  VIDEOGRAPHER = "videographer",
  MECHANIC = "mechanic",
  CARPENTER = "carpenter",
  PAINTER = "painter",
  CHILDCARE = "childcare",
  ELDERCARE = "eldercare",
  PET_CARE = "pet_care",
  TUTOR = "tutor",
}

// JobType 카테고리
export const JOB_CATEGORIES = {
  RESTAURANT: "Restaurant",
  RETAIL: "Retail",
  SERVICE: "Service",
  TECHNICAL: "Technical",
  MEDICAL: "Medical",
  TRADES: "Trades",
  OFFICE: "Office",
  EVENTS: "Events",
  LOGISTICS: "Logistics",
  EDUCATION: "Education",
  CARE: "Care",
  OTHER: "Other",
} as const;

// JobType을 위한 클라이언트 매핑 인터페이스
export interface JobTypeConfig {
  id: JobType;
  name: string;
  category: string;
  icon: React.ComponentType<any>;
  isCommon: boolean;
}

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
    name: "Teacher/Instructor",
    category: JOB_CATEGORIES.EDUCATION,
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
  [JobType.HOST]: {
    id: JobType.HOST,
    name: "Host/Hostess",
    category: JOB_CATEGORIES.RESTAURANT,
    icon: Users,
    isCommon: false,
  },
  [JobType.HOUSEKEEPING]: {
    id: JobType.HOUSEKEEPING,
    name: "Housekeeping",
    category: JOB_CATEGORIES.SERVICE,
    icon: Home,
    isCommon: false,
  },
  [JobType.EVENT_STAFF]: {
    id: JobType.EVENT_STAFF,
    name: "Event Staff",
    category: JOB_CATEGORIES.EVENTS,
    icon: Briefcase,
    isCommon: false,
  },
  [JobType.PACKER]: {
    id: JobType.PACKER,
    name: "Packer",
    category: JOB_CATEGORIES.LOGISTICS,
    icon: Package,
    isCommon: false,
  },
  [JobType.CONSTRUCTION_WORKER]: {
    id: JobType.CONSTRUCTION_WORKER,
    name: "Construction Worker",
    category: JOB_CATEGORIES.TRADES,
    icon: Hammer,
    isCommon: false,
  },
  [JobType.MAINTENANCE]: {
    id: JobType.MAINTENANCE,
    name: "Maintenance",
    category: JOB_CATEGORIES.TRADES,
    icon: Wrench,
    isCommon: false,
  },
  [JobType.LANDSCAPER]: {
    id: JobType.LANDSCAPER,
    name: "Landscaper",
    category: JOB_CATEGORIES.TRADES,
    icon: Leaf,
    isCommon: false,
  },
  [JobType.ADMIN_ASSISTANT]: {
    id: JobType.ADMIN_ASSISTANT,
    name: "Admin Assistant",
    category: JOB_CATEGORIES.OFFICE,
    icon: Clipboard,
    isCommon: false,
  },
  [JobType.DATA_ENTRY]: {
    id: JobType.DATA_ENTRY,
    name: "Data Entry",
    category: JOB_CATEGORIES.OFFICE,
    icon: Type,
    isCommon: false,
  },
  [JobType.CONTENT_CREATOR]: {
    id: JobType.CONTENT_CREATOR,
    name: "Content Creator",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Camera,
    isCommon: false,
  },
  [JobType.PHOTOGRAPHER]: {
    id: JobType.PHOTOGRAPHER,
    name: "Photographer",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Camera,
    isCommon: false,
  },
  [JobType.VIDEOGRAPHER]: {
    id: JobType.VIDEOGRAPHER,
    name: "Videographer",
    category: JOB_CATEGORIES.TECHNICAL,
    icon: Video,
    isCommon: false,
  },
  [JobType.MECHANIC]: {
    id: JobType.MECHANIC,
    name: "Mechanic",
    category: JOB_CATEGORIES.TRADES,
    icon: Wrench,
    isCommon: false,
  },
  [JobType.CARPENTER]: {
    id: JobType.CARPENTER,
    name: "Carpenter",
    category: JOB_CATEGORIES.TRADES,
    icon: Hammer,
    isCommon: false,
  },
  [JobType.PAINTER]: {
    id: JobType.PAINTER,
    name: "Painter",
    category: JOB_CATEGORIES.TRADES,
    icon: Paintbrush,
    isCommon: false,
  },
  [JobType.CHILDCARE]: {
    id: JobType.CHILDCARE,
    name: "Childcare",
    category: JOB_CATEGORIES.CARE,
    icon: Baby,
    isCommon: false,
  },
  [JobType.ELDERCARE]: {
    id: JobType.ELDERCARE,
    name: "Eldercare",
    category: JOB_CATEGORIES.CARE,
    icon: Heart,
    isCommon: false,
  },
  [JobType.PET_CARE]: {
    id: JobType.PET_CARE,
    name: "Pet Care",
    category: JOB_CATEGORIES.CARE,
    icon: PawPrint,
    isCommon: false,
  },
  [JobType.TUTOR]: {
    id: JobType.TUTOR,
    name: "Tutor",
    category: JOB_CATEGORIES.EDUCATION,
    icon: BookOpen,
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

// 특정 JobType의 설정을 가져오는 헬퍼 함수
export const getJobTypeConfig = (jobType: JobType): JobTypeConfig => {
  return JOB_TYPE_CONFIGS[jobType];
};

// 서버에서 받은 JobType enum 값으로부터 클라이언트 설정을 가져오는 함수
export const getJobTypeConfigFromServer = (serverJobType: string): JobTypeConfig | null => {
  // 1) 서버값(UPPER_SNAKE_CASE)을 소문자로 변환해 바로 매칭 (예: CUSTOMER_SERVICE -> customer_service)
  const lowered = (serverJobType || "").toLowerCase();
  if (Object.values(JobType).includes(lowered as JobType)) {
    return JOB_TYPE_CONFIGS[lowered as JobType];
  }

  // 2) 호환성: enumMapper의 fromPrismaJobType에 위임 (과거 매핑 유지)
  try {
    const mapped = fromPrismaJobType(serverJobType);
    if (mapped && JOB_TYPE_CONFIGS[mapped]) return JOB_TYPE_CONFIGS[mapped];
  } catch (_) {}

  return null;
};

// 서버에서 받은 JobType enum 값으로부터 UI에 필요한 정보를 가져오는 함수들
export const getJobTypeName = (serverJobType: string): string => {
  const config = getJobTypeConfigFromServer(serverJobType);
  return config?.name || serverJobType;
};
