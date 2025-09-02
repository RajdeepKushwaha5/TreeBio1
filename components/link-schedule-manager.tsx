"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, CheckCircle, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LinkSchedule {
  isScheduled: boolean;
  startDate?: Date;
  endDate?: Date;
  timezone?: string;
}

export interface ScheduledLinkProps {
  schedule?: LinkSchedule;
  onScheduleChange: (schedule: LinkSchedule) => void;
  className?: string;
}

export function LinkScheduleManager({ 
  schedule = { isScheduled: false },
  onScheduleChange,
  className 
}: ScheduledLinkProps) {
  const now = new Date();
  const isActive = !schedule.isScheduled || 
    ((!schedule.startDate || schedule.startDate <= now) && 
     (!schedule.endDate || schedule.endDate > now));

  const handleScheduleToggle = (enabled: boolean) => {
    const newSchedule: LinkSchedule = {
      ...schedule,
      isScheduled: enabled,
      startDate: enabled && !schedule.startDate ? new Date() : schedule.startDate,
      endDate: enabled && !schedule.endDate ? undefined : schedule.endDate
    };
    onScheduleChange(newSchedule);
  };

  const handleStartDateChange = (dateString: string) => {
    const startDate = dateString ? new Date(dateString) : undefined;
    onScheduleChange({
      ...schedule,
      startDate
    });
  };

  const handleEndDateChange = (dateString: string) => {
    const endDate = dateString ? new Date(dateString) : undefined;
    onScheduleChange({
      ...schedule,
      endDate
    });
  };

  const formatDateTime = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().slice(0, 16); // Format for datetime-local input
  };

  const getScheduleStatus = (): { status: string; color: string; icon: React.ReactNode } => {
    if (!schedule.isScheduled) {
      return { status: 'Always Active', color: 'text-green-600', icon: <CheckCircle size={16} /> };
    }

    const now = new Date();
    const hasStarted = !schedule.startDate || schedule.startDate <= now;
    const hasEnded = schedule.endDate && schedule.endDate <= now;

    if (hasEnded) {
      return { status: 'Expired', color: 'text-red-600', icon: <Pause size={16} /> };
    }

    if (!hasStarted) {
      return { status: 'Scheduled', color: 'text-blue-600', icon: <Clock size={16} /> };
    }

    if (hasStarted && (!schedule.endDate || schedule.endDate > now)) {
      return { status: 'Active', color: 'text-green-600', icon: <Play size={16} /> };
    }

    return { status: 'Unknown', color: 'text-gray-600', icon: <AlertCircle size={16} /> };
  };

  const statusInfo = getScheduleStatus();
  const isValidSchedule = !schedule.isScheduled || 
    (!schedule.startDate || !schedule.endDate || schedule.startDate < schedule.endDate);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>Link Scheduling</span>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'} className={statusInfo.color}>
            <div className="flex items-center space-x-1">
              {statusInfo.icon}
              <span>{statusInfo.status}</span>
            </div>
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Schedule Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Enable Scheduling</Label>
            <p className="text-xs text-muted-foreground">
              Set specific dates when this link should be active
            </p>
          </div>
          <Switch
            checked={schedule.isScheduled}
            onCheckedChange={handleScheduleToggle}
          />
        </div>

        {schedule.isScheduled && (
          <div className="space-y-4 pt-4 border-t">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium">
                Start Date & Time (Optional)
              </Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={formatDateTime(schedule.startDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                When should this link become active? Leave empty to make it active immediately.
              </p>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium">
                End Date & Time (Optional)
              </Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={formatDateTime(schedule.endDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                When should this link expire? Leave empty to keep it active indefinitely.
              </p>
            </div>

            {/* Validation Warning */}
            {!isValidSchedule && (
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  End date must be after the start date
                </p>
              </div>
            )}

            {/* Schedule Summary */}
            {isValidSchedule && (schedule.startDate || schedule.endDate) && (
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Schedule Summary</span>
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {schedule.startDate && (
                    <div className="flex justify-between">
                      <span>Becomes active:</span>
                      <span className="font-medium">
                        {schedule.startDate.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {schedule.endDate && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span className="font-medium">
                        {schedule.endDate.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {schedule.startDate && schedule.endDate && (
                    <div className="flex justify-between pt-2 border-t">
                      <span>Active duration:</span>
                      <span className="font-medium">
                        {Math.ceil((schedule.endDate.getTime() - schedule.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 7);
                    onScheduleChange({
                      ...schedule,
                      startDate,
                      endDate
                    });
                  }}
                >
                  1 Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 1);
                    onScheduleChange({
                      ...schedule,
                      startDate,
                      endDate
                    });
                  }}
                >
                  1 Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + 3);
                    onScheduleChange({
                      ...schedule,
                      startDate,
                      endDate
                    });
                  }}
                >
                  3 Months
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    onScheduleChange({
                      ...schedule,
                      startDate,
                      endDate
                    });
                  }}
                >
                  1 Year
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Utility component for displaying schedule status in lists
export function ScheduleStatusBadge({ 
  schedule, 
  className 
}: { 
  schedule?: LinkSchedule; 
  className?: string; 
}) {
  if (!schedule?.isScheduled) {
    return (
      <Badge variant="outline" className={cn("text-green-600", className)}>
        <CheckCircle size={12} className="mr-1" />
        Always Active
      </Badge>
    );
  }

  const now = new Date();
  const hasStarted = !schedule.startDate || schedule.startDate <= now;
  const hasEnded = schedule.endDate && schedule.endDate <= now;

  if (hasEnded) {
    return (
      <Badge variant="destructive" className={className}>
        <Pause size={12} className="mr-1" />
        Expired
      </Badge>
    );
  }

  if (!hasStarted) {
    return (
      <Badge variant="secondary" className={className}>
        <Clock size={12} className="mr-1" />
        Scheduled
      </Badge>
    );
  }

  return (
    <Badge variant="default" className={cn("bg-green-600", className)}>
      <Play size={12} className="mr-1" />
      Active
    </Badge>
  );
}

export default LinkScheduleManager;
