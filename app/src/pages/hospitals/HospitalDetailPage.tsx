import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { hospitalsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { formatDate, formatPhoneForDisplay, getStatusColor, getSubscriptionLabel } from '@/lib/utils';

export function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: hospitalData, isLoading: isLoadingHospital } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => hospitalsApi.getHospitalById(id!),
    enabled: !!id,
  });

  const { data: claimsData, isLoading: isLoadingClaims } = useQuery({
    queryKey: ['hospital-claims', id],
    queryFn: () => hospitalsApi.getHospitalClaims(id!, { limit: 5 }),
    enabled: !!id,
  });

  const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['hospital-payments', id],
    queryFn: () => hospitalsApi.getHospitalPayments(id!, { limit: 5 }),
    enabled: !!id,
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['hospital-stats', id],
    queryFn: () => hospitalsApi.getHospitalStats(id!),
    enabled: !!id,
  });

  const hospital = hospitalData?.data?.data;
  const claims = claimsData?.data?.data || [];
  const payments = paymentsData?.data?.data || [];
  const stats = statsData?.data?.data;

  if (isLoadingHospital) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Hospital not found</h2>
        <p className="text-muted-foreground mb-4">
          The hospital you're looking for doesn't exist
        </p>
        <Button onClick={() => navigate('/hospitals')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hospitals
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/hospitals')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{hospital.name}</h1>
            <p className="text-muted-foreground">
              SHA Facility Code: {hospital.shaFacilityCode}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(hospital.subscription.status)}>
          {hospital.subscription.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hospital Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{hospital.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SHA Facility Code</p>
                  <p className="font-medium">{hospital.shaFacilityCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-medium">{hospital.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">County</p>
                  <p className="font-medium">{hospital.county}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{hospital.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {formatPhoneForDisplay(hospital.phoneNumber)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {hospital.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp ID</p>
                  <p className="font-medium">{hospital.whatsappId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{hospital.contactPerson?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {hospital.contactPerson?.role}
                  </p>
                  <p className="text-sm">{hospital.contactPerson?.phone}</p>
                  <p className="text-sm">{hospital.contactPerson?.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="grid gap-4 md:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Claims</p>
                    <p className="text-2xl font-bold">{stats?.totalClaims || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats?.claimsByStatus?.completed || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Payments</p>
                    <p className="text-2xl font-bold">{stats?.paymentCount || 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">KES {stats?.totalPayments?.toLocaleString() || 0}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Latest claims from this hospital</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingClaims ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : claims.length === 0 ? (
                <p className="text-muted-foreground">No claims yet</p>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim: any) => (
                    <div key={claim._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{claim.claimNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(claim.submittedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/claims/${claim._id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Payment history for this hospital</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPayments ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : payments.length === 0 ? (
                <p className="text-muted-foreground">No payments yet</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment: any) => (
                    <div key={payment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">KES {payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.type.replace('_', ' ')} • {formatDate(payment.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium text-lg">
                    {getSubscriptionLabel(hospital.subscription.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(hospital.subscription.status)}>
                    {hospital.subscription.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Claims Used This Month</p>
                  <p className="font-medium">
                    {hospital.subscription.claimsUsedThisMonth} / {hospital.subscription.claimsLimit}
                  </p>
                </div>
                {hospital.subscription.startDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(hospital.subscription.startDate)}</p>
                  </div>
                )}
                {hospital.subscription.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{formatDate(hospital.subscription.endDate)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
