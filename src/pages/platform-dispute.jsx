// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Textarea, Avatar, AvatarFallback, AvatarImage, Input } from '@/components/ui';
// @ts-ignore;
import { MessageCircle, User, Calendar, AlertTriangle } from 'lucide-react';

const mockDisputes = [{
  id: 1,
  orderId: 'ORD-2024-001',
  title: '居民用电报装纠纷',
  type: 'quality_issue',
  status: 'pending',
  customer: {
    name: '李女士',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    complaint: '电工安装不规范，存在安全隐患'
  },
  worker: {
    name: '张师傅',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    response: '已按标准施工，客户要求过高'
  },
  createTime: '2024-01-16 10:30',
  amount: 2000,
  evidence: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
}, {
  id: 2,
  orderId: 'ORD-2024-002',
  title: '商业用电增容争议',
  type: 'price_dispute',
  status: 'processing',
  customer: {
    name: '王总',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    complaint: '实际费用超出预算太多'
  },
  worker: {
    name: '李师傅',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    response: '增加了额外工程量，已提前告知'
  },
  createTime: '2024-01-15 15:20',
  amount: 8000,
  evidence: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400']
}];
export default function PlatformDispute(props) {
  const {
    $w
  } = props;
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [ruling, setRuling] = useState('');
  const [compensation, setCompensation] = useState('');
  const getStatusBadge = status => {
    const statusMap = {
      pending: {
        label: '待处理',
        color: 'bg-yellow-100 text-yellow-800'
      },
      processing: {
        label: '处理中',
        color: 'bg-blue-100 text-blue-800'
      },
      resolved: {
        label: '已解决',
        color: 'bg-green-100 text-green-800'
      }
    };
    return statusMap[status] || {
      label: '未知',
      color: 'bg-gray-100 text-gray-800'
    };
  };
  const getTypeLabel = type => {
    const typeMap = {
      quality_issue: '质量问题',
      price_dispute: '价格争议',
      service_delay: '服务延期',
      other: '其他'
    };
    return typeMap[type] || '未知类型';
  };
  const handleResolve = disputeId => {
    alert(`纠纷 ${disputeId} 已处理完成！`);
    setSelectedDispute(null);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h1 className="text-lg font-semibold text-center">纠纷处理</h1>
      </div>

      <div className="p-4 space-y-4">
        {mockDisputes.map(dispute => {
        const status = getStatusBadge(dispute.status);
        return <Card key={dispute.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{dispute.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{dispute.orderId}</p>
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">纠纷类型：</span>
                      <span className="text-sm">{getTypeLabel(dispute.type)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">涉及金额：</span>
                      <span className="text-sm font-semibold text-red-600">¥{dispute.amount}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dispute.customer.avatar} />
                        <AvatarFallback>{dispute.customer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{dispute.customer.name} (客户)</p>
                        <p className="text-sm text-gray-600">{dispute.customer.complaint}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dispute.worker.avatar} />
                        <AvatarFallback>{dispute.worker.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{dispute.worker.name} (技工)</p>
                        <p className="text-sm text-gray-600">{dispute.worker.response}</p>
                      </div>
                    </div>
                  </div>

                  {dispute.evidence && <div>
                      <p className="text-sm font-semibold mb-2">证据图片</p>
                      <div className="grid grid-cols-3 gap-2">
                        {dispute.evidence.map((img, index) => <img key={index} src={img} alt={`evidence-${index}`} className="w-full h-20 object-cover rounded cursor-pointer" onClick={() => window.open(img, '_blank')} />)}
                      </div>
                    </div>}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>提交时间：{dispute.createTime}</span>
                  </div>

                  {dispute.status !== 'resolved' && <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                        处理纠纷
                      </Button>
                      <Button variant="outline" size="sm">
                        联系双方
                      </Button>
                    </div>}
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {selectedDispute && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>处理纠纷</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">处理结果</label>
                <Textarea placeholder="请输入处理结果..." value={ruling} onChange={e => setRuling(e.target.value)} className="min-h-[100px]" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">赔偿金额</label>
                <Input type="number" placeholder="请输入赔偿金额" value={compensation} onChange={e => setCompensation(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedDispute(null)}>
                  取消
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => handleResolve(selectedDispute.id)}>
                  确认处理
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>;
}