import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileText,
  Building2,
  CreditCard,
  MessageSquare,
  Clock,
  AlertCircle,
  Download,
  Send,
  Upload,
} from 'lucide-react';
import { claimsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatDate, formatDateTime, formatKES, getStatusColor, formatPhoneForDisplay } from '@/lib/utils';

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimsApi.getClaimById(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      claimsApi.updateStatus(id!, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const sendDocumentMutation = useMutation({
    mutationFn: () => claimsApi.sendCorrectedDocument(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      toast.success('Corrected document sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send document');
    },
  });

  const claim = data?.data?.claim;

  if (isLoading) {
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

  if (!claim) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Claim not found</h2>
        <p className="text-muted-foreground mb-4">
          The claim you're looking for doesn't exist
        </p>
        <Button onClick={() => navigate('/claims')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Claims
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/claims')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{claim.claimNumber}</h1>
            <p className="text-muted-foreground">
              Submitted on {formatDate(claim.submittedAt)}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(claim.status)}>
          {claim.status.replace('_', ' ')}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
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
                  <p className="font-medium">{claim.hospital?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SHA Facility Code</p>
                  <p className="font-medium">{claim.hospital?.shaFacilityCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {formatPhoneForDisplay(claim.hospital?.phoneNumber || '')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{claim.hospital?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">County</p>
                  <p className="font-medium">{claim.hospital?.county}</p>
                </div>
              </CardContent>
            </Card>

            {/* Claim Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Claim Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Claim Number</p>
                  <p className="font-medium">{claim.claimNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDateTime(claim.submittedAt)}</p>
                </div>
                {claim.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="font-medium">{formatDateTime(claim.completedAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Diagnosis Codes</p>
                  <p className="font-medium">
                    {claim.diagnosisCodes?.join(', ') || 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Procedure Codes</p>
                  <p className="font-medium">
                    {claim.procedureCodes?.join(', ') || 'None'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add notes about this claim..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button
                onClick={() => {
                  claimsApi.addNotes(id!, notes).then(() => {
                    toast.success('Notes added');
                    setNotes('');
                    queryClient.invalidateQueries({ queryKey: ['claim', id] });
                  });
                }}
                disabled={!notes.trim()}
              >
                Add Notes
              </Button>
              {claim.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{claim.notes}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Documents</CardTitle>
              <CardDescription>Documents submitted by the hospital</CardDescription>
            </CardHeader>
            <CardContent>
              {claim.originalDocuments?.length === 0 ? (
                <p className="text-muted-foreground">No original documents</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {claim.originalDocuments?.map((doc: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type.toUpperCase()} • {formatDate(doc.uploadedAt)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corrected Documents</CardTitle>
              <CardDescription>Documents after review and corrections</CardDescription>
            </CardHeader>
            <CardContent>
              {claim.correctedDocuments?.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No corrected documents yet</p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Corrected Document
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {claim.correctedDocuments?.map((doc: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => sendDocumentMutation.mutate()}
                          disabled={sendDocumentMutation.isPending || claim.status === 'completed'}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send to Hospital
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim Analysis</CardTitle>
              <CardDescription>Automated analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              {!claim.analysisResult ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Analysis not started yet</p>
                  <Button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        status: 'analyzing',
                        notes: 'Started analysis',
                      })
                    }
                  >
                    Start Analysis
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${claim.analysisResult.confidence}%` }}
                        />
                      </div>
                      <span className="font-medium">{claim.analysisResult.confidence}%</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="font-medium mb-4">Detected Issues</p>
                    {claim.analysisResult.errors?.length === 0 ? (
                      <p className="text-muted-foreground">No issues detected</p>
                    ) : (
                      <div className="space-y-3">
                        {claim.analysisResult.errors?.map((error: any, index: number) => (
                          <div key={index} className="p-4 bg-yellow-50 rounded-lg">
                            <p className="font-medium text-yellow-800">{error.field}</p>
                            <p className="text-sm text-yellow-700">{error.issue}</p>
                            <p className="text-sm text-yellow-600 mt-1">
                              Suggestion: {error.suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Processed At</p>
                    <p>{formatDateTime(claim.analysisResult.processedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">{formatKES(claim.payment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(claim.payment.status)}>
                    {claim.payment.status}
                  </Badge>
                </div>
              </div>

              {claim.payment.mpesaReceiptNumber && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">M-Pesa Receipt</p>
                    <p className="font-medium">{claim.payment.mpesaReceiptNumber}</p>
                  </div>
                  {claim.payment.transactionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction Date</p>
                      <p className="font-medium">{formatDateTime(claim.payment.transactionDate)}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversation Tab */}
        <TabsContent value="conversation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                WhatsApp Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conversation history will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
