// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, useToast } from '@/components/ui';
// @ts-ignore;
import { MapPin, DollarSign, Calendar } from 'lucide-react';

export default function WorkerOrderHall(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const workerId = $w.page.dataset.params.workerId;
  useEffect(() => {
    loadOrders();
  }, []);
  const loadOrders = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              status: {
                $eq: 'pending'
              }
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            publish_time: 'desc'
          }]
        }
      });
      setOrders(result.records);
    } catch (error) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTakeOrder = async orderId => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'processing',
            worker_id: workerId
          },
          filter: {
            where: {
              _id: {
                $eq: orderId
              }
            }
          }
        }
      });

      // 更新技工接单数
      const workerResult = await $w.cloud.callDataSource({
        dataSourceName: 'electric_worker',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: workerId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_worker',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            order_count: workerResult.order_count + 1
          },
          filter: {
            where: {
              _id: {
                $eq: workerId
              }
            }
          }
        }
      });
      toast({
        title: '接单成功',
        description: '请及时联系客户确认工作细节'
      });
      loadOrders();
    } catch (error) {
      toast({
        title: '接单失败',
        description: error.message,
        variant: 'destructive'
      });
    }
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
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h1 className="text-lg font-semibold text-center">订单大厅</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="residential">居民</TabsTrigger>
          <TabsTrigger value="commercial">商业</TabsTrigger>
          <TabsTrigger value="industrial">工业</TabsTrigger>
          <TabsTrigger value="maintenance">维修</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="p-4">
          <div className="space-y-4">
            {orders.map(order => {
            const type = getTypeBadge(order.business_type);
            return <Card key={order._id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{order.business_type}</CardTitle>
                        <Badge className={type.color}>{type.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{order.demand_description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{order.service_address}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>预算 ¥{order.budget}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(order.publish_time)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => $w.utils.navigateTo({
                    pageId: 'worker-order-detail',
                    params: {
                      id: order._id
                    }
                  })}>
                          查看详情
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={() => handleTakeOrder(order._id)}>
                          立即接单
                        </Button>
                      </div>
                    </CardContent>
                  </Card>;
          })}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
}