import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, getStatusColor } from '@/lib/utils';

// Mock data for conversations
const mockConversations = [
  {
    _id: '1',
    hospital: { name: 'Nairobi West Hospital', shaFacilityCode: '123456' },
    messages: [
      { direction: 'inbound', content: 'Hello, I have a claim to submit', timestamp: new Date().toISOString() },
      { direction: 'outbound', content: 'Please send the claim documents', timestamp: new Date().toISOString() },
    ],
    sessionWindow: { isActive: true, endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    hospital: { name: 'Aga Khan University Hospital', shaFacilityCode: '234567' },
    messages: [
      { direction: 'inbound', content: 'Claim SHA-20240101-12345 status?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
    sessionWindow: { isActive: false, endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export function ConversationsPage() {
  const [search, setSearch] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');

  const isLoading = false;
  const conversations = mockConversations;

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Send message logic here
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Manage WhatsApp conversations with hospitals
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conversation: any) => (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{conversation.hospital?.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {conversation.messages[conversation.messages.length - 1]?.content}
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
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedConversation.hospital?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.hospital?.shaFacilityCode}
                    </p>
                  </div>
                  <Badge className={getStatusColor(selectedConversation.sessionWindow?.isActive ? 'active' : 'inactive')}>
                    {selectedConversation.sessionWindow?.isActive ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Active Session</>
                    ) : (
                      <><Clock className="h-3 w-3 mr-1" /> Session Expired</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.direction === 'outbound'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.direction === 'outbound' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatRelativeTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
