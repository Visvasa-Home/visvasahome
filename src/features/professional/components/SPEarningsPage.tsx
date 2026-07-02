import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Award, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { getEarnings, getCompletedJobs, type SPEarnings, type SPJob } from '@professional/services/spJobService';

interface SPEarningsPageProps {
  onBack: () => void;
}

export const SPEarningsPage = ({ onBack }: SPEarningsPageProps) => {
  const [earnings, setEarnings] = useState<SPEarnings | null>(null);
  const [recentJobs, setRecentJobs] = useState<SPJob[]>([]);
  const [loading, setLoading] = useState(true);

  const spId = 'SP001';

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const [earningsData, jobs] = await Promise.all([
        getEarnings(spId),
        getCompletedJobs(spId)
      ]);
      setEarnings(earningsData);
      setRecentJobs(jobs.slice(0, 10));
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading || !earnings) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onBack} variant="ghost">← Back</Button>
          <div className="text-center py-12">
            <p className="text-[color:var(--color-text-secondary)]">Loading earnings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-20">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="mb-2">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">My Earnings</h1>
          <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
            Track your income and performance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-[color:var(--color-text-secondary)] mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Today</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(earnings.today)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-[color:var(--color-text-secondary)] mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">This Week</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(earnings.week)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-[color:var(--color-text-secondary)] mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">This Month</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(earnings.month)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-[color:var(--color-text-secondary)] mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Total Earned</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(earnings.total)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Completed Jobs</span>
              </div>
              <span className="font-semibold">{earnings.completedJobs}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm">Average Rating</span>
              </div>
              <span className="font-semibold">{earnings.averageRating.toFixed(1)} / 5.0</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2563EB]" />
                <span className="text-sm">Pending Payout</span>
              </div>
              <span className="font-semibold text-[#2563EB]">
                {formatCurrency(earnings.pendingPayout)}
              </span>
            </div>

            <div className="pt-4 border-t border-[color:var(--color-border)]">
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                * Payouts are processed on the 1st and 15th of each month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payout Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-900 mb-1">Next Payout</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(earnings.pendingPayout)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-800">Scheduled Date</p>
                <p className="font-semibold text-gray-900">15th June 2026</p>
              </div>
            </div>
            <Button variant="default" className="w-full">
              Request Early Payout
            </Button>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between py-3 border-b border-[color:var(--color-border)] last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{job.serviceName}</p>
                      <p className="text-sm text-[color:var(--color-text-secondary)]">
                        {job.customerName}
                      </p>
                      <p className="text-xs text-[color:var(--color-text-tertiary)] mt-1">
                        {job.completeTime && formatDate(job.completeTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(job.earnings - job.commission)}
                      </p>
                      {job.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs">{job.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[color:var(--color-text-secondary)]">
                  No completed jobs yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--color-text-secondary)]">Gross Earnings</span>
              <span className="font-semibold">
                {formatCurrency(Math.floor(earnings.month * 1.25))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--color-text-secondary)]">Platform Fee (20%)</span>
              <span className="text-[color:var(--color-text-secondary)]">
                - {formatCurrency(Math.floor(earnings.month * 0.25))}
              </span>
            </div>
            <div className="flex justify-between font-semibold pt-3 border-t border-[color:var(--color-border)]">
              <span>Net Earnings</span>
              <span className="text-green-600">{formatCurrency(earnings.month)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
