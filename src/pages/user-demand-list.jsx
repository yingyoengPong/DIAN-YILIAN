// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';
// @ts-ignore;
import { MapPin, DollarSign, Calendar } from 'lucide-react';

export default function UserDemandList(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('all');
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const userId = $w.page.dataset.params.userId;
  useEffect(() => {
    loadDemands();
  }, [userId]);
  const loadDemands = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              customer_id: {
                $eq: userId
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
      setDemands(result.records);
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
      }
    };
    return statusMap[status] || {
      label: '未知',
      color: 'bg-gray-100 text-gray-800'
    };
  };
  const filteredDemands = activeTab === 'all' ? demands : demands.filter(demand => demand.status === activeTab);
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
        <h1 className="text-lg font-semibold text-center">我的需求</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待接单</TabsTrigger>
          <TabsTrigger value="processing">进行中</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="p-4">
          <div className="space-y-4">
            {filteredDemands.map(demand => {
            const status = getStatusBadge(demand.status);
            return <Card key={demand._id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{demand.business_type}</CardTitle>
                        <Badge className={status.color}>{status.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{demand.demand_description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{demand.service_address}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>预算 ¥{demand.budget}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(demand.publish_time)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => $w.utils.navigateTo({
                    pageId: 'user-demand-detail',
                    params: {
                      id: demand._id
                    }
                  })}>
                          查看详情
                        </Button>
                        {demand.status === 'completed' && !demand.evaluation && <Button variant="outline" size="sm">
                            评价
                          </Button>}
                      </div>
                    </CardContent>
                  </Card>;
          })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => $w.utils.navigateTo({
        pageId: 'user-publish-demand',
        params: {
          userId: userId
        }
      })}>
          发布新需求
        </Button>
      </div>
    </div>;
}