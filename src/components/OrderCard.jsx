// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
// @ts-ignore;
import { MapPin, DollarSign, Calendar, User, Phone } from 'lucide-react';

export function OrderCard({
  order,
  onViewDetail,
  onProcess
}) {
  const getStatusBadge = status => {
    const statusMap = {
      pending: {
        label: '待接单',
        color: 'bg-orange-100 text-orange-800'
      },
      processing: {
        label: '进行中',
        color: 'bg-blue-100 text-blue-800'
      },
      completed: {
        label: '已完成',
        color: 'bg-green-100 text-green-800'
      },
      disputed: {
        label: '纠纷中',
        color: 'bg-red-100 text-red-800'
      }
    };
    return statusMap[status] || {
      label: '未知',
      color: 'bg-gray-100 text-gray-800'
    };
  };
  const getTypeBadge = type => {
    const typeMap = {
      residential: {
        label: '居民用电',
        color: 'bg-green-100 text-green-800'
      },
      commercial: {
        label: '商业用电',
        color: 'bg-blue-100 text-blue-800'
      },
      industrial: {
        label: '工业用电',
        color: 'bg-purple-100 text-purple-800'
      },
      maintenance: {
        label: '电路维修',
        color: 'bg-orange-100 text-orange-800'
      }
    };
    return typeMap[type] || {
      label: '其他',
      color: 'bg-gray-100 text-gray-800'
    };
  };
  const formatDate = timestamp => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };
  const statusInfo = getStatusBadge(order.status);
  const typeInfo = getTypeBadge(order.business_type);
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{order.business_type}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">¥{order.budget}</div>
            <div className="text-sm text-gray-500">{order.order_number}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-1">需求描述</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{order.demand_description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">客户：</span>
              <div className="flex items-center mt-1">
                <User className="h-4 w-4 text-gray-400 mr-1" />
                <span>{order.customer_info?.name || '匿名用户'}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">联系电话：</span>
              <div className="flex items-center mt-1">
                <Phone className="h-4 w-4 text-gray-400 mr-1" />
                <span>{order.customer_info?.phone || '未提供'}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-gray-500">服务地址：</span>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm">{order.service_address}</span>
            </div>
          </div>

          <div>
            <span className="text-gray-500">预约时间：</span>
            <div className="flex items-center mt-1">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm">{formatDate(order.appointment_time)}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetail(order)}>
              查看详情
            </Button>
            {order.status === 'disputed' && <Button variant="destructive" size="sm" onClick={() => onProcess(order)}>
                处理纠纷
              </Button>}
            {order.status === 'completed' && <Button variant="default" size="sm" onClick={() => onProcess(order)}>
                确认结算
              </Button>}
          </div>
        </div>
      </CardContent>
    </Card>;
}