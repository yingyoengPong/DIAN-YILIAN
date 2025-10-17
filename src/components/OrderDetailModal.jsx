// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Badge, Button } from '@/components/ui';
// @ts-ignore;
import { MapPin, Calendar, DollarSign, User, Phone, Image } from 'lucide-react';

export function OrderDetailModal({
  order,
  isOpen,
  onClose
}) {
  if (!order) return null;
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
  const formatDate = timestamp => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };
  const statusInfo = getStatusBadge(order.status);
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>订单详情</DialogTitle>
          <DialogDescription>订单编号：{order.order_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{order.business_type}</h3>
              <Badge className={statusInfo.color} className="mt-1">{statusInfo.label}</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">¥{order.budget}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">客户信息</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{order.customer_info?.name || '匿名用户'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{order.customer_info?.phone || '未提供'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">技工信息</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{order.worker_info?.name || '未接单'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{order.worker_info?.phone || '未提供'}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">需求描述</h4>
            <p className="text-sm text-gray-600">{order.demand_description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">服务地址</h4>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span>{order.service_address}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">预约时间</h4>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span>{formatDate(order.appointment_time)}</span>
              </div>
            </div>
          </div>

          {order.images && order.images.length > 0 && <div>
              <h4 className="font-medium mb-2">现场图片</h4>
              <div className="grid grid-cols-3 gap-2">
                {order.images.map((img, index) => <img key={index} src={img} alt={`现场-${index}`} className="w-full h-24 object-cover rounded" />)}
              </div>
            </div>}

          {order.completion_images && order.completion_images.length > 0 && <div>
              <h4 className="font-medium mb-2">完成图片</h4>
              <div className="grid grid-cols-3 gap-2">
                {order.completion_images.map((img, index) => <img key={index} src={img} alt={`完成-${index}`} className="w-full h-24 object-cover rounded" />)}
              </div>
            </div>}

          {order.evaluation && <div>
              <h4 className="font-medium mb-2">客户评价</h4>
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center mb-2">
                  <div className="text-yellow-400">
                    {'★'.repeat(order.evaluation.rating)}
                    {'☆'.repeat(5 - order.evaluation.rating)}
                  </div>
                  <span className="ml-2 text-sm">{order.evaluation.rating}星评价</span>
                </div>
                <p className="text-sm text-gray-600">{order.evaluation.comment}</p>
              </div>
            </div>}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          {order.status === 'disputed' && <Button variant="destructive">
              处理纠纷
            </Button>}
          {order.status === 'completed' && <Button>
              确认结算
            </Button>}
        </div>
      </DialogContent>
    </Dialog>;
}