"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UserRole, UserStatus } from "@/models/enums";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export function FilterDialog({ open, onOpenChange, onApply }: FilterDialogProps) {
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    minTrustScore: 0,
    maxTrustScore: 100,
    startDate: "",
    endDate: "",
  });

  const handleApply = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== null)
    );
    onApply(cleanedFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      role: "",
      status: "",
      minTrustScore: 0,
      maxTrustScore: 100,
      startDate: "",
      endDate: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
          <DialogDescription>Set criteria to filter the user list</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Filter */}
          <div>
            <Label>Role</Label>
            <Select
              value={filters.role}
              onValueChange={(v) => setFilters({ ...filters, role: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.USER}>User</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(v) => setFilters({ ...filters, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={UserStatus.BANNED}>Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trust Score Range */}
          <div>
            <Label>Trust Score Range</Label>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs">Min: {filters.minTrustScore}</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[filters.minTrustScore]}
                    onValueChange={(v) => setFilters({ ...filters, minTrustScore: v[0] })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-xs">Max: {filters.maxTrustScore}</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[filters.maxTrustScore]}
                    onValueChange={(v) => setFilters({ ...filters, maxTrustScore: v[0] })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label>Joined Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">From</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
