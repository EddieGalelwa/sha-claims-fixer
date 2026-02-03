import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Building2,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatKES, formatRelativeTime } from '@/lib/utils';

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const dashboardData = stats?.data?.data;

  const statCards = [
    {
      title: 'Total Hospitals',
      value: dashboardData?.totalHospitals || 0,
      icon: Building2,
      description: `${dashboardData?.activeHospitals || 0} active`,
    },
    {
      title: 'Total Claims',
      value: dashboardData?.totalClaims || 0,
      icon: FileText,
      description: `${dashboardData?.claimsByStatus?.received || 0} pending`,
    },
    {
      title: 'Total Revenue',
      value: formatKES(dashboardData?.totalRevenue || 0),
      icon: CreditCard,
      description: `${formatKES(dashboardData?.monthlyRevenue || 0)} this month`,
    },
    {
      title: 'Pending Payments',
      value: dashboardData?.pendingPayments || 0,
      icon: TrendingUp,
      description: 'Awaiting M-Pesa confirmation',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your SHA Claims Fixer system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Claims Status & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Claims by Status */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
            <CardDescription>Current distribution of claim statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.claimsByStatus && Object.entries(dashboardData.claimsByStatus).map(([status, count]) => {
                  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
                    received: { label: 'Received', icon: AlertCircle, color: 'text-blue-500' },
                    analyzing: { label: 'Analyzing', icon: Clock, color: 'text-yellow-500' },
                    awaiting_payment: { label: 'Awaiting Payment', icon: CreditCard, color: 'text-orange-500' },
                    payment_received: { label: 'Payment Received', icon: CheckCircle, color: 'text-green-500' },
                    processing: { label: 'Processing', icon: Clock, color: 'text-purple-500' },
                    completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
                    rejected: { label: 'Rejected', icon: AlertCircle, color: 'text-red-500' },
                  };
                  const config = statusConfig[status] || { label: status, icon: AlertCircle, color: 'text-gray-500' };
                  const Icon = config.icon;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-sm font-medium">{config.label}</span>
                      </div>
                      <span className="text-sm font-bold">{count as number}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Claims */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
            <CardDescription>Latest submitted claims</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.recentClaims?.slice(0, 5).map((claim: any) => (
                  <div key={claim._id} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{claim.claimNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {claim.hospital?.name || 'Unknown Hospital'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        claim.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : claim.status === 'awaiting_payment'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {claim.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(claim.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Conversations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Conversations</CardTitle>
          <CardDescription>Recent WhatsApp conversations with hospitals</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData?.recentConversations?.slice(0, 3).map((conversation: any) => (
                <div key={conversation._id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{conversation.hospital?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.messages?.[conversation.messages.length - 1]?.content?.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      conversation.sessionWindow?.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {conversation.sessionWindow?.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(conversation.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
