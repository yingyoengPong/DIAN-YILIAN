// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Textarea, useToast } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, MapPin, Calendar, DollarSign, Phone, MessageCircle, Upload, CheckCircle, Badge } from 'lucide-react';

export default function WorkerOrderDetail(props) {
  const {
    $w
  } = props;
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [completionImages, setCompletionImages] = useState([]);
  const [completionNote, setCompletionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const orderId = $w.page.dataset.params.id;
  const workerId = $w.page.dataset.params.workerId;
  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);
  const loadOrderDetail = async () => {
    try {
      const orderResult = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: orderId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      setOrder(orderResult);
      if (orderResult.customer_id) {
        const customerResult = await $w.cloud.callDataSource({
          dataSourceName: 'electric_worker',
          methodName: 'wedaGetItemV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: orderResult.customer_id
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        setCustomer(customerResult);
      }
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
  const handleTakeOrder = async () => {
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
      loadOrderDetail();
    } catch (error) {
      toast({
        title: '接单失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleUploadComplete = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'completed',
            completion_time: new Date().getTime()
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
      toast({
        title: '完成凭证上传成功',
        description: '等待客户确认'
      });
      setShowUpload(false);
      loadOrderDetail();
    } catch (error) {
      toast({
        title: '上传失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleApplySettlement = async () => {
    try {
      // 更新资金托管状态
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_escrow',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: 'processing',
            settlement_time: new Date().getTime()
          },
          filter: {
            where: {
              demand_id: {
                $eq: orderId
              }
            }
          }
        }
      });
      toast({
        title: '结算申请已提交',
        description: '平台将在24小时内处理'
      });
    } catch (error) {
      toast({
        title: '申请失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    setCompletionImages(prev => [...prev, ...files]);
  };
  const formatDate = timestamp => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>;
  }
  if (!order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">订单不存在</div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 mr-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">订单详情</h1>
      </div>

      <div className="p-4 space-y-4 pb-20">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{order.business_type}</CardTitle>
              <Badge variant={order.status === 'pending' ? 'secondary' : order.status === 'processing' ? 'default' : 'success'}>
                {order.status === 'pending' ? '待接单' : order.status === 'processing' ? '进行中' : '已完成'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">需求描述</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{order.demand_description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">预算：</span>
                <span className="font-semibold text-green-600">¥{order.budget}</span>
              </div>
              <div>
                <span className="text-gray-500">发布时间：</span>
                <span>{formatDate(order.publish_time)}</span>
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

            {order.images && order.images.length > 0 && <div>
                <h3 className="font-semibold mb-2">现场图片</h3>
                <div className="grid grid-cols-3 gap-2">
                  {order.images.map((img, index) => <img key={index} src={img} alt={`现场-${index}`} className="w-full h-24 object-cover rounded" />)}
                </div>
              </div>}
          </CardContent>
        </Card>

        {customer && <Card>
            <CardHeader>
              <CardTitle>客户信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback>{customer.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{customer.name}</h4>
                  <p className="text-sm text-gray-600">联系电话：{customer.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>}

        {order.status === 'processing' && <Card>
            <CardHeader>
              <CardTitle>服务进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span>已接单</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-blue-500 rounded-full mr-3" />
                  <span>服务进行中</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3" />
                  <span className="text-gray-500">等待客户确认</span>
                </div>
              </div>
            </CardContent>
          </Card>}

        {order.status === 'pending' && <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleTakeOrder}>
            立即接单
          </Button>}

        {order.status === 'processing' && <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowUpload(true)}>
            上传完成凭证
          </Button>}

        {order.status === 'completed' && <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleApplySettlement}>
            申请结算
          </Button>}

        {showUpload && <Card>
            <CardHeader>
              <CardTitle>上传完成凭证</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">完成图片</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="completion-upload" />
                <label htmlFor="completion-upload" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-600">上传完成图片</span>
                </label>
                {completionImages.length > 0 && <div className="mt-2 grid grid-cols-3 gap-2">
                    {completionImages.map((image, index) => <img key={index} src={URL.createObjectURL(image)} alt={`completion-${index}`} className="w-full h-20 object-cover rounded" />)}
                  </div>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">完成说明</label>
                <Textarea placeholder="请描述完成的工作内容..." value={completionNote} onChange={e => setCompletionNote(e.target.value)} className="min-h-[100px]" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpload(false)}>
                  取消
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleUploadComplete}>
                  确认上传
                </Button>
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
}