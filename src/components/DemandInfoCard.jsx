// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
// @ts-ignore;
import { MapPin, Calendar, DollarSign } from 'lucide-react';

export function DemandInfoCard({
  demand
}) {
  const getStatusInfo = status => {
    const statusMap = {
      pending: {
        label: '待接单',
        color: 'text-orange-600 bg-orange-50'
      },
      processing: {
        label: '进行中',
        color: 'text-blue-600 bg-blue-50'
      },
      completed: {
        label: '已完成',
        color: 'text-green-600 bg-green-50'
      }
    };
    return statusMap[status] || {
      label: '未知',
      color: 'text-gray-600 bg-gray-50'
    };
  };
  const formatDate = timestamp => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };
  const statusInfo = getStatusInfo(demand.status);
  return <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{demand.business_type}</CardTitle>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">需求描述</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{demand.demand_description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">预算：</span>
            <span className="font-semibold text-green-600">¥{demand.budget}</span>
          </div>
          <div>
            <span className="text-gray-500">发布时间：</span>
            <span>{formatDate(demand.publish_time)}</span>
          </div>
        </div>

        <div>
          <span className="text-gray-500">服务地址：</span>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm">{demand.service_address}</span>
          </div>
        </div>

        <div>
          <span className="text-gray-500">预约时间：</span>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm">{formatDate(demand.appointment_time)}</span>
          </div>
        </div>

        {demand.images && demand.images.length > 0 && <div>
            <h3 className="font-semibold mb-2">现场图片</h3>
            <div className="grid grid-cols-3 gap-2">
              {demand.images.map((img, index) => <img key={index} src={img} alt={`现场-${index}`} className="w-full h-24 object-cover rounded" />)}
            </div>
          </div>}
      </CardContent>
    </Card>;
}