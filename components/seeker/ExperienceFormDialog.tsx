"use client";
import React from "react";
import { Dialog } from "@/components/common/Dialog";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { WORK_PERIOD_OPTIONS } from "@/constants/options";
import { WorkType, WorkPeriod } from "@/constants/enums";
import { JobType, getJobTypeConfig } from "@/constants/jobTypes";

interface ExperienceForm {
  company: string;
  jobType?: JobType;
  startYear: string;
  workedPeriod?: WorkPeriod;
  workType?: WorkType;
  description: string;
}

interface ExperienceFormDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  experienceForm: ExperienceForm;
  setExperienceForm: React.Dispatch<React.SetStateAction<ExperienceForm>>;
  onSave: () => void;
  editingIndex: number | null;
  onJobTypeSelect: () => void;
}

export default function ExperienceFormDialog({
  title,
  open,
  onClose,
  experienceForm,
  setExperienceForm,
  onSave,
  editingIndex,
  onJobTypeSelect,
}: ExperienceFormDialogProps) {
  // 컴포넌트 내부에서 years 생성
  const years = Array.from({ length: 20 }, (_, i) => ({
    value: (2025 - i).toString(),
    label: (2025 - i).toString(),
  }));

  return (
    <Dialog open={open} onClose={onClose} type="bottomSheet">
      <div className="space-y-4">
        <Typography as="h3" variant="titleBold" className="mb-4">
          {title || "Add Job Experience"}
        </Typography>
        <Input
          label="Company Name"
          placeholder="Enter company name"
          value={experienceForm.company}
          onChange={(e) => setExperienceForm((f) => ({ ...f, company: e.target.value }))}
        />

        <div className="flex gap-2">
          <div className="w-1/2">
            <Typography as="label" variant="bodySm" className="block mb-2">
              Work Type
            </Typography>
            <Select
              value={experienceForm.workType || ""}
              onValueChange={(val: string) =>
                setExperienceForm((f) => ({ ...f, workType: val as WorkType }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={WorkType.REMOTE}>Remote</SelectItem>
                <SelectItem value={WorkType.ON_SITE}>On-site</SelectItem>
                <SelectItem value={WorkType.HYBRID}>Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Input
              label="Job Type"
              placeholder="Select Job Type"
              value={experienceForm.jobType ? getJobTypeConfig(experienceForm.jobType).name : ""}
              onChange={(e) =>
                setExperienceForm((f) => ({ ...f, jobType: e.target.value as JobType }))
              }
              onClick={onJobTypeSelect}
              readOnly
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <Typography as="label" variant="bodySm" className="block mb-2">
              Start Year
            </Typography>
            <Select
              value={experienceForm.startYear || ""}
              onValueChange={(val: string) => setExperienceForm((f) => ({ ...f, startYear: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Typography as="label" variant="bodySm" className="block mb-2">
              Worked Period
            </Typography>
            <Select
              value={experienceForm.workedPeriod || ""}
              onValueChange={(val: string) =>
                setExperienceForm((f) => ({ ...f, workedPeriod: val as WorkPeriod }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {WORK_PERIOD_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <TextArea
          label="Description"
          placeholder="Enter description"
          rows={3}
          value={experienceForm.description}
          onChange={(e) => setExperienceForm((f) => ({ ...f, description: e.target.value }))}
        />
        <Button
          onClick={onSave}
          size="lg"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          disabled={
            !experienceForm.company ||
            !experienceForm.jobType ||
            !experienceForm.startYear ||
            !experienceForm.workedPeriod ||
            !experienceForm.workType ||
            !experienceForm.description
          }
        >
          {editingIndex === null ? "Add" : "Save"}
        </Button>
      </div>
    </Dialog>
  );
}
