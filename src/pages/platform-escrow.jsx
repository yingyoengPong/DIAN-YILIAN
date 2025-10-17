// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
// @ts-ignore;
import { DollarSign, Calendar, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const mockTransactions = [{
  id: 1,
  type: 'deposit',
  orderId: 'ORD-2024-001',
  amount: 2000,
  customer: '李女士',
  worker: '张师傅',
  status: 'completed',
  createTime: '2024-01-15 14:30',
  completeTime: '2024-01-15 16:45'
}, {
  id: 2,
  type: 'withdrawal',
  orderId: 'ORD-2024-002',
  amount: 8000,
  customer: '王总',
  worker: '李师傅',
  status: 'pending',
  createTime: '2024-01-15 10:20',
  completeTime: null
}, {
  id: 3,
  type: 'deposit',
  orderId: 'ORD-2024-003',
  amount: 500,
  customer: '赵先生',
  worker: '王师傅',
  status: 'completed',
  createTime: '2024-01-14 09:15',
  completeTime: '2024-01-14 11:30'
}];
export default function PlatformEscrow(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('all');
  const getTypeBadge = type => {
    const typeMap = {
      deposit: {
        label: '存入',
        color: 'bg-green-100 text-green-800',
        icon: ArrowDownLeft
      },
      withdrawal: {
        label: '转出',
        color: 'bg-blue-100 text-blue-800',
        icon: ArrowUpRight
      }
    };
    return typeMap[type] || {
      label: '未知',
      color: 'bg-gray-100 text-gray-800',
      icon: DollarSign
    };
  };
  const getStatusBadge = status => {
    const statusMap = {
      pending: {
        label: '处理中',
        color: 'bg-yellow-100 text-yellow-800'
      },
      completed: {
        label: '已完成',
        color: 'bg-green-100 text-green-800'
      },
      failed: {
        label: '失败',
        color: 'bg-red-100 text-red-800'
      }
    };
    return statusMap[status] || {
      label: '未知',
      color: 'bg-gray-100 text-gray-800'
    };
  };
  const filteredTransactions = activeTab === 'all' ? mockTransactions : mockTransactions.filter(tx => tx.type === activeTab);
  const totalBalance = mockTransactions.filter(tx => tx.status === 'completed').reduce((sum, tx) => {
    return tx.type === 'deposit' ? sum + tx.amount : sum - tx.amount;
  }, 0);
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h1 className="text-lg font-semibold text-center">资金托管</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>资金总览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">¥{totalBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">当前托管余额</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="deposit">存入</TabsTrigger>
            <TabsTrigger value="withdrawal">转出</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="p-0">
            <div className="space-y-4">
              {filteredTransactions.map(tx => {
              const type = getTypeBadge(tx.type);
              const status = getStatusBadge(tx.status);
              const Icon = type.icon;
              return <Card key={tx.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${type.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold">{tx.orderId}</p>
                            <p className="text-sm text-gray-600">
                              {tx.type === 'deposit' ? `${tx.customer} → 平台` : `平台 → ${tx.worker}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${tx.type === 'deposit' ? 'text-green-600' : 'text-blue-600'}`}>
                            {tx.type === 'deposit' ? '+' : '-'}¥{tx.amount}
                          </p>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>创建时间：{tx.createTime}</span>
                        </div>
                        {tx.completeTime && <div className="flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>完成时间：{tx.completeTime}</span>
                          </div>}
                      </div>

                      {tx.status === 'pending' && <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            查看详情
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            确认转出
                          </Button>
                        </div>}
                    </CardContent>
                  </Card>;
            })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}