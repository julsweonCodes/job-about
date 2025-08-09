export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      applicant_profiles: {
        Row: {
          available_day: Database["public"]["Enums"]["AvailableDay"]
          available_hour: Database["public"]["Enums"]["AvailableHour"]
          created_at: string
          deleted_at: string | null
          description: string
          id: number
          job_type1: Database["public"]["Enums"]["JobType"]
          job_type2: Database["public"]["Enums"]["JobType"] | null
          job_type3: Database["public"]["Enums"]["JobType"] | null
          language_level: Database["public"]["Enums"]["LanguageLevel"]
          location: Database["public"]["Enums"]["Location"]
          updated_at: string
          user_id: number
          work_type: Database["public"]["Enums"]["WorkType"]
        }
        Insert: {
          available_day: Database["public"]["Enums"]["AvailableDay"]
          available_hour: Database["public"]["Enums"]["AvailableHour"]
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: number
          job_type1: Database["public"]["Enums"]["JobType"]
          job_type2?: Database["public"]["Enums"]["JobType"] | null
          job_type3?: Database["public"]["Enums"]["JobType"] | null
          language_level: Database["public"]["Enums"]["LanguageLevel"]
          location: Database["public"]["Enums"]["Location"]
          updated_at?: string
          user_id: number
          work_type: Database["public"]["Enums"]["WorkType"]
        }
        Update: {
          available_day?: Database["public"]["Enums"]["AvailableDay"]
          available_hour?: Database["public"]["Enums"]["AvailableHour"]
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: number
          job_type1?: Database["public"]["Enums"]["JobType"]
          job_type2?: Database["public"]["Enums"]["JobType"] | null
          job_type3?: Database["public"]["Enums"]["JobType"] | null
          language_level?: Database["public"]["Enums"]["LanguageLevel"]
          location?: Database["public"]["Enums"]["Location"]
          updated_at?: string
          user_id?: number
          work_type?: Database["public"]["Enums"]["WorkType"]
        }
        Relationships: [
          {
            foreignKeyName: "applicant_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          job_post_id: number
          profile_id: number
          status: Database["public"]["Enums"]["ApplicationStatus"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          job_post_id: number
          profile_id: number
          status: Database["public"]["Enums"]["ApplicationStatus"]
          updated_at: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          job_post_id?: number
          profile_id?: number
          status?: Database["public"]["Enums"]["ApplicationStatus"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "applicant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarked_jobs: {
        Row: {
          id: number
          job_post_id: number
          user_id: number
        }
        Insert: {
          id?: number
          job_post_id: number
          user_id: number
        }
        Update: {
          id?: number
          job_post_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookmarked_jobs_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarked_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_loc: {
        Row: {
          address: string
          created_at: string
          deleted_at: string | null
          description: string
          id: number
          img_url1: string | null
          img_url2: string | null
          img_url3: string | null
          img_url4: string | null
          img_url5: string | null
          location: Database["public"]["Enums"]["Location"]
          logo_url: string | null
          name: string
          operating_end: string
          operating_start: string
          phone_number: string
          updated_at: string
          user_id: number
        }
        Insert: {
          address: string
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: number
          img_url1?: string | null
          img_url2?: string | null
          img_url3?: string | null
          img_url4?: string | null
          img_url5?: string | null
          location: Database["public"]["Enums"]["Location"]
          logo_url?: string | null
          name: string
          operating_end: string
          operating_start: string
          phone_number: string
          updated_at?: string
          user_id: number
        }
        Update: {
          address?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: number
          img_url1?: string | null
          img_url2?: string | null
          img_url3?: string | null
          img_url4?: string | null
          img_url5?: string | null
          location?: Database["public"]["Enums"]["Location"]
          logo_url?: string | null
          name?: string
          operating_end?: string
          operating_start?: string
          phone_number?: string
          updated_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_loc_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dimensions: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_post_practical_skills: {
        Row: {
          created_at: string
          job_post_id: number
          practical_skill_id: number
        }
        Insert: {
          created_at?: string
          job_post_id: number
          practical_skill_id: number
        }
        Update: {
          created_at?: string
          job_post_id?: number
          practical_skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_post_practical_skills_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_post_practical_skills_practical_skill_id_fkey"
            columns: ["practical_skill_id"]
            isOneToOne: false
            referencedRelation: "practical_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      job_post_preferred_profiles: {
        Row: {
          job_post_id: number
          profile_id: number
        }
        Insert: {
          job_post_id: number
          profile_id: number
        }
        Update: {
          job_post_id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_post_preferred_profiles_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_post_preferred_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "personality_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_post_work_styles: {
        Row: {
          created_at: string
          job_post_id: number
          work_style_id: number
        }
        Insert: {
          created_at?: string
          job_post_id: number
          work_style_id: number
        }
        Update: {
          created_at?: string
          job_post_id?: number
          work_style_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_post_work_styles_job_post_id_fkey"
            columns: ["job_post_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_post_work_styles_work_style_id_fkey"
            columns: ["work_style_id"]
            isOneToOne: false
            referencedRelation: "work_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          business_loc_id: number
          created_at: string
          deadline: string
          deleted_at: string | null
          description: string
          id: number
          job_type: Database["public"]["Enums"]["JobType"]
          language_level: Database["public"]["Enums"]["LanguageLevel"] | null
          status: Database["public"]["Enums"]["JobStatus"]
          title: string
          updated_at: string
          user_id: number
          wage: string
          work_schedule: string
          work_type: Database["public"]["Enums"]["WorkType"] | null
        }
        Insert: {
          business_loc_id: number
          created_at?: string
          deadline: string
          deleted_at?: string | null
          description: string
          id?: number
          job_type: Database["public"]["Enums"]["JobType"]
          language_level?: Database["public"]["Enums"]["LanguageLevel"] | null
          status: Database["public"]["Enums"]["JobStatus"]
          title: string
          updated_at?: string
          user_id: number
          wage: string
          work_schedule: string
          work_type?: Database["public"]["Enums"]["WorkType"] | null
        }
        Update: {
          business_loc_id?: number
          created_at?: string
          deadline?: string
          deleted_at?: string | null
          description?: string
          id?: number
          job_type?: Database["public"]["Enums"]["JobType"]
          language_level?: Database["public"]["Enums"]["LanguageLevel"] | null
          status?: Database["public"]["Enums"]["JobStatus"]
          title?: string
          updated_at?: string
          user_id?: number
          wage?: string
          work_schedule?: string
          work_type?: Database["public"]["Enums"]["WorkType"] | null
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_business_loc_id_fkey"
            columns: ["business_loc_id"]
            isOneToOne: false
            referencedRelation: "business_loc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      personality_profiles: {
        Row: {
          created_at: string
          description_en: string
          description_ko: string
          id: number
          name_en: string
          name_ko: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en: string
          description_ko: string
          id?: number
          name_en: string
          name_ko: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_ko?: string
          id?: number
          name_en?: string
          name_ko?: string
          updated_at?: string
        }
        Relationships: []
      }
      personality_work_style_weights: {
        Row: {
          personality_id: number
          weight: number
          work_style_id: number
        }
        Insert: {
          personality_id: number
          weight?: number
          work_style_id: number
        }
        Update: {
          personality_id?: number
          weight?: number
          work_style_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personality_work_style_weights_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "personality_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personality_work_style_weights_work_style_id_fkey"
            columns: ["work_style_id"]
            isOneToOne: false
            referencedRelation: "work_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      practical_skills: {
        Row: {
          category_en: string
          category_ko: string
          created_at: string
          id: number
          name_en: string
          name_ko: string
          updated_at: string
        }
        Insert: {
          category_en: string
          category_ko: string
          created_at?: string
          id?: number
          name_en: string
          name_ko: string
          updated_at?: string
        }
        Update: {
          category_en?: string
          category_ko?: string
          created_at?: string
          id?: number
          name_en?: string
          name_ko?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile_practical_skills: {
        Row: {
          created_at: string
          practical_skill_id: number
          profile_id: number
        }
        Insert: {
          created_at?: string
          practical_skill_id: number
          profile_id: number
        }
        Update: {
          created_at?: string
          practical_skill_id?: number
          profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_practical_skills_practical_skill_id_fkey"
            columns: ["practical_skill_id"]
            isOneToOne: false
            referencedRelation: "practical_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_practical_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "applicant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_choices: {
        Row: {
          content_en: string
          content_ko: string
          created_at: string
          emoji: string | null
          id: number
          label: Database["public"]["Enums"]["QuizLabel"]
          question_id: number
        }
        Insert: {
          content_en: string
          content_ko: string
          created_at?: string
          emoji?: string | null
          id?: number
          label: Database["public"]["Enums"]["QuizLabel"]
          question_id: number
        }
        Update: {
          content_en?: string
          content_ko?: string
          created_at?: string
          emoji?: string | null
          id?: number
          label?: Database["public"]["Enums"]["QuizLabel"]
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          content_en: string
          content_ko: string
          created_at: string
          dimension_id: number
          id: number
          img_url: string | null
          question_code: string
          quiz_set_id: string
        }
        Insert: {
          content_en: string
          content_ko: string
          created_at?: string
          dimension_id: number
          id?: number
          img_url?: string | null
          question_code: string
          quiz_set_id: string
        }
        Update: {
          content_en?: string
          content_ko?: string
          created_at?: string
          dimension_id?: number
          id?: number
          img_url?: string | null
          question_code?: string
          quiz_set_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "dimensions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_responses: {
        Row: {
          choice_id: number
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          choice_id: number
          created_at?: string
          id?: number
          user_id: number
        }
        Update: {
          choice_id?: number
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_responses_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "quiz_choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          id: number
          img_url: string | null
          name: string
          personality_profile_id: number | null
          phone_number: string | null
          role: Database["public"]["Enums"]["Role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: number
          img_url?: string | null
          name: string
          personality_profile_id?: number | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: number
          img_url?: string | null
          name?: string
          personality_profile_id?: number | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_personality_profile_id_fkey"
            columns: ["personality_profile_id"]
            isOneToOne: false
            referencedRelation: "personality_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_experiences: {
        Row: {
          company_name: string
          created_at: string
          deleted_at: string | null
          description: string
          id: number
          job_type: Database["public"]["Enums"]["JobType"]
          profile_id: number
          start_year: string
          updated_at: string
          work_period: Database["public"]["Enums"]["WorkPeriod"]
          work_type: Database["public"]["Enums"]["WorkType"]
        }
        Insert: {
          company_name: string
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: number
          job_type: Database["public"]["Enums"]["JobType"]
          profile_id: number
          start_year: string
          updated_at: string
          work_period: Database["public"]["Enums"]["WorkPeriod"]
          work_type: Database["public"]["Enums"]["WorkType"]
        }
        Update: {
          company_name?: string
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: number
          job_type?: Database["public"]["Enums"]["JobType"]
          profile_id?: number
          start_year?: string
          updated_at?: string
          work_period?: Database["public"]["Enums"]["WorkPeriod"]
          work_type?: Database["public"]["Enums"]["WorkType"]
        }
        Relationships: [
          {
            foreignKeyName: "work_experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "applicant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_styles: {
        Row: {
          created_at: string
          id: number
          name_en: string
          name_ko: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name_en: string
          name_ko: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name_en?: string
          name_ko?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ApplicationStatus:
        | "APPLIED"
        | "IN_REVIEW"
        | "REJECTED"
        | "WITHDRAWN"
        | "HIRED"
      AvailableDay: "WEEKDAYS" | "WEEKENDS"
      AvailableHour: "AM" | "PM"
      JobStatus: "DRAFT" | "PUBLISHED" | "CLOSED"
      JobType:
        | "SERVER"
        | "KITCHEN"
        | "DELIVERY"
        | "CASHIER"
        | "CLEANING"
        | "CUSTOMER_SERVICE"
        | "SALES"
        | "DRIVER"
        | "RECEPTIONIST"
        | "SECURITY"
        | "MANAGER"
        | "BARISTA"
        | "CHEF"
        | "STOCKER"
        | "TECH_SUPPORT"
        | "WAREHOUSE"
        | "ACCOUNTANT"
        | "MARKETING"
        | "HR"
        | "DESIGNER"
        | "DEVELOPER"
        | "ENGINEER"
        | "TEACHER"
        | "TRANSLATOR"
        | "PHARMACIST"
        | "NURSE"
        | "DOCTOR"
        | "FARMER"
        | "ELECTRICIAN"
        | "PLUMBER"
        | "JANITOR"
        | "HOST"
        | "HOUSEKEEPING"
        | "EVENT_STAFF"
        | "PACKER"
        | "CONSTRUCTION_WORKER"
        | "MAINTENANCE"
        | "LANDSCAPER"
        | "ADMIN_ASSISTANT"
        | "DATA_ENTRY"
        | "CONTENT_CREATOR"
        | "PHOTOGRAPHER"
        | "VIDEOGRAPHER"
        | "MECHANIC"
        | "CARPENTER"
        | "PAINTER"
        | "CHILDCARE"
        | "ELDERCARE"
        | "PET_CARE"
        | "TUTOR"
      LanguageLevel: "BEGINNER" | "INTERMEDIATE" | "FLUENT" | "NOT_REQUIRED"
      Location:
        | "TORONTO"
        | "NORTH_YORK"
        | "SCARBOROUGH"
        | "ETOBICOKE"
        | "MISSISSAUGA"
        | "BRAMPTON"
        | "VAUGHAN"
        | "RICHMOND_HILL"
        | "MARKHAM"
        | "THORNHILL"
        | "PICKERING"
        | "AJAX"
        | "WHITBY"
        | "OSHAWA"
        | "OAKVILLE"
        | "BURLINGTON"
        | "MILTON"
        | "NEWHAMBURG"
        | "VANCOUVER"
        | "SURREY"
        | "VICTORIA"
        | "BURNABY"
        | "KELOWNA"
        | "RICHMOND"
        | "ABBOTSFORD"
        | "LANGLEY"
        | "KAMLOOPS"
        | "NANAIMO"
        | "NORTH_VANCOUVER"
        | "DELTA"
        | "PRINCE_GEORGE"
        | "COQUITLAM"
        | "CHILLIWACK"
      QuizLabel: "A" | "B"
      Role: "APPLICANT" | "EMPLOYER"
      WorkPeriod:
        | "SHORT_TERM"
        | "UNDER_3_MONTHS"
        | "UNDER_6_MONTHS"
        | "SIX_TO_TWELVE_MONTHS"
        | "ONE_TO_TWO_YEARS"
        | "TWO_TO_THREE_YEARS"
        | "THREE_TO_FIVE_YEARS"
        | "FIVE_TO_SEVEN_YEARS"
        | "SEVEN_TO_TEN_YEARS"
        | "OVER_TEN_YEARS"
      WorkType: "REMOTE" | "ON_SITE" | "HYBRID"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ApplicationStatus: [
        "APPLIED",
        "IN_REVIEW",
        "REJECTED",
        "WITHDRAWN",
        "HIRED",
      ],
      AvailableDay: ["WEEKDAYS", "WEEKENDS"],
      AvailableHour: ["AM", "PM"],
      JobStatus: ["DRAFT", "PUBLISHED", "CLOSED"],
      JobType: [
        "SERVER",
        "KITCHEN",
        "DELIVERY",
        "CASHIER",
        "CLEANING",
        "CUSTOMER_SERVICE",
        "SALES",
        "DRIVER",
        "RECEPTIONIST",
        "SECURITY",
        "MANAGER",
        "BARISTA",
        "CHEF",
        "STOCKER",
        "TECH_SUPPORT",
        "WAREHOUSE",
        "ACCOUNTANT",
        "MARKETING",
        "HR",
        "DESIGNER",
        "DEVELOPER",
        "ENGINEER",
        "TEACHER",
        "TRANSLATOR",
        "PHARMACIST",
        "NURSE",
        "DOCTOR",
        "FARMER",
        "ELECTRICIAN",
        "PLUMBER",
        "JANITOR",
        "HOST",
        "HOUSEKEEPING",
        "EVENT_STAFF",
        "PACKER",
        "CONSTRUCTION_WORKER",
        "MAINTENANCE",
        "LANDSCAPER",
        "ADMIN_ASSISTANT",
        "DATA_ENTRY",
        "CONTENT_CREATOR",
        "PHOTOGRAPHER",
        "VIDEOGRAPHER",
        "MECHANIC",
        "CARPENTER",
        "PAINTER",
        "CHILDCARE",
        "ELDERCARE",
        "PET_CARE",
        "TUTOR",
      ],
      LanguageLevel: ["BEGINNER", "INTERMEDIATE", "FLUENT", "NOT_REQUIRED"],
      Location: [
        "TORONTO",
        "NORTH_YORK",
        "SCARBOROUGH",
        "ETOBICOKE",
        "MISSISSAUGA",
        "BRAMPTON",
        "VAUGHAN",
        "RICHMOND_HILL",
        "MARKHAM",
        "THORNHILL",
        "PICKERING",
        "AJAX",
        "WHITBY",
        "OSHAWA",
        "OAKVILLE",
        "BURLINGTON",
        "MILTON",
        "NEWHAMBURG",
        "VANCOUVER",
        "SURREY",
        "VICTORIA",
        "BURNABY",
        "KELOWNA",
        "RICHMOND",
        "ABBOTSFORD",
        "LANGLEY",
        "KAMLOOPS",
        "NANAIMO",
        "NORTH_VANCOUVER",
        "DELTA",
        "PRINCE_GEORGE",
        "COQUITLAM",
        "CHILLIWACK",
      ],
      QuizLabel: ["A", "B"],
      Role: ["APPLICANT", "EMPLOYER"],
      WorkPeriod: [
        "SHORT_TERM",
        "UNDER_3_MONTHS",
        "UNDER_6_MONTHS",
        "SIX_TO_TWELVE_MONTHS",
        "ONE_TO_TWO_YEARS",
        "TWO_TO_THREE_YEARS",
        "THREE_TO_FIVE_YEARS",
        "FIVE_TO_SEVEN_YEARS",
        "SEVEN_TO_TEN_YEARS",
        "OVER_TEN_YEARS",
      ],
      WorkType: ["REMOTE", "ON_SITE", "HYBRID"],
    },
  },
} as const
