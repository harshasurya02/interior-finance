"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/types/project";
import { addProject, editProject } from "@/lib/actions/project";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
// import { addProject, updateProject } from "@/lib/projects";

const projectSchema = z.object({
  site_name: z.string().min(1),
  expenses: z.number().min(0),
  incoming: z.number().min(0),
  initial_quotation: z.number().min(0),
  final_quotation: z.number().min(0),
  site_status_id: z.string().min(1),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  statusOptions?: { id: string; site_status_name: string }[];
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
  statusOptions,
}: ProjectModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      site_name: "",
      expenses: 0,
      incoming: 0,
      initial_quotation: 0,
      final_quotation: 0,
      site_status_id: "67aec197-0989-484d-8b2f-7839366917cd",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (project) {
      reset(project);
    } else {
      reset({
        site_name: "",
        expenses: 0,
        incoming: 0,
        initial_quotation: 0,
        final_quotation: 0,
        site_status_id: "67aec197-0989-484d-8b2f-7839366917cd",
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    console.log(data);
    if (project) {
      await editProject(data, project.id);
    } else {
      await addProject(data);
    }
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Project Name</Label>
            <Controller
              name="site_name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  id="site_name"
                  required
                  onChange={field.onChange}
                />
              )}
            />
            {errors.site_name && (
              <span className="text-red-500">{errors.site_name.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_status_id">Status</Label>
            <Controller
              name="site_status_id"
              control={control}
              defaultValue="67aec197-0989-484d-8b2f-7839366917cd"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions &&
                      statusOptions.length > 0 &&
                      statusOptions.map((option) => (
                        <SelectItem value={option.id} key={option.id}>
                          {option.site_status_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.site_status_id && (
              <span className="text-red-500">
                {errors.site_status_id.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="initial_quotation">Initial Quotation</Label>
            <Controller
              name="initial_quotation"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Input
                  {...field}
                  id="initial_quotation"
                  type="number"
                  onChange={(e) => {
                    // Convert the string value to a number
                    const value = parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                  required
                />
              )}
            />
            {errors.initial_quotation && (
              <span className="text-red-500">
                {errors.initial_quotation.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="final_quotation">Final Quotation (Optional)</Label>
            <Controller
              name="final_quotation"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Input
                  {...field}
                  id="final_quotation"
                  type="number"
                  onChange={(e) => {
                    // Convert the string value to a number
                    const value = parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.final_quotation && (
              <span className="text-red-500">
                {errors.final_quotation.message}
              </span>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{project ? "Update" : "Add"} Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
