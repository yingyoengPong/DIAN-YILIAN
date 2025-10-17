// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast, Tabs, TabsContent, TabsList, TabsTrigger, Badge } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, MapPin, Clock, User, Phone, Star, CheckCircle, MessageSquare, FileText, Shield, AlertCircle } from 'lucide-react';

import { OrderMapView } from '@/components/OrderMapView';
import { DistanceCalculator } from '@/components/DistanceCalculator';
export default function OrderDetail(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [order, setOrder] = useState(null);
  const [userType, setUserType] = useState('customer');
  const [activeTab, setActiveTab] = useState('info');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    // 从路由参数获取订单ID和用户类型
    const params = $w.page.dataset.params;
    setUserType(params.userType || 'customer');

    // 获取用户当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lng: position.coords.longitude,
          lat: position.coords.latitude
        });
      });
    }

    // 模拟订单数据
    const mockOrder = {
      id: params.orderId || '1',
      title: '家庭用电报装',
      address: '北京市朝阳区建国门外大街1号',
      location: {
        lng: 116.397428,
        lat: 39.90923
      },
      description: '需要安装家庭用电线路，包括客厅、卧室、厨房的插座和照明线路。要求使用国标材料，安全可靠。现有电路情况：老房子，需要重新布线。',
      budget: 800,
      price: 750,
      urgency: 'normal',
      contact: '138****1234',
      status: 'pending',
      createTime: '2025-10-17 10:30',
      expectedTime: '3天内',
      serviceType: 'installation',
      technician: null,
      rating: null,
      progress: [{
        time: '2025-10-17 10:30',
        action: '订单创建',
        status: 'completed'
      }, {
        time: '2025-10-17 11:00',
        action: '等待技工接单',
        status: 'pending'
      }]
    };
    setOrder(mockOrder);
  }, [$w]);
  if (!order) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">加载中...</div>
    </div>;
  }
  const handleAcceptOrder = () => {
    setOrder(prev => ({
      ...prev,
      status: 'accepted',
      technician: $w.auth.currentUser?.name || '张师傅',
      progress: [...prev.progress, {
        time: new Date().toLocaleString(),
        action: '技工接单',
        status: 'completed'
      }, {
        time: '进行中',
        action: '联系用户确认细节',
        status: 'current'
      }]
    }));
    toast({
      title: '接单成功',
      description: '请及时联系用户确认工作细节'
    });
  };
  const handleCompleteOrder = () => {
    setOrder(prev => ({
      ...prev,
      status: 'completed',
      progress: [...prev.progress.filter(p => p.status !== 'current'), {
        time: new Date().toLocaleString(),
        action: '工作完成',
        status: 'completed'
      }, {
        time: '等待中',
        action: '等待用户确认',
        status: 'pending'
      }]
    }));
    toast({
      title: '工作完成',
      description: '已通知用户确认'
    });
  };
  const handleConfirmCompletion = () => {
    setOrder(prev => ({
      ...prev,
      status: 'confirmed',
      progress: [...prev.progress, {
        time: new Date().toLocaleString(),
        action: '用户确认完成',
        status: 'completed'
      }]
    }));
    toast({
      title: '确认完成',
      description: '感谢您的使用，请对服务进行评价'
    });
  };
  const handleRate = selectedRating => {
    setRating(selectedRating);
    setOrder(prev => ({
      ...prev,
      rating: selectedRating
    }));
    toast({
      title: '评价成功',
      description: `感谢您的${selectedRating}星评价`
    });
  };
  const handleSubmitComment = () => {
    if (comment.trim()) {
      toast({
        title: '评价提交成功',
        description: '您的评价对其他用户很有帮助'
      });
      setComment('');
    }
  };
  const handleUploadFile = () => {
    // 模拟文件上传
    const newFile = {
      id: Date.now(),
      name: `工作凭证_${new Date().toLocaleDateString()}.jpg`,
      time: new Date().toLocaleString()
    };
    setUploadedFiles(prev => [...prev, newFile]);
    toast({
      title: '上传成功',
      description: '工作凭证已上传'
    });
  };
  const getStatusInfo = () => {
    const statusInfo = {
      pending: {
        text: '待接单',
        color: 'bg-yellow-100 text-yellow-800',
        action: null
      },
      accepted: {
        text: '已接单',
        color: 'bg-blue-100 text-blue-800',
        action: '联系技工'
      },
      in_progress: {
        text: '进行中',
        color: 'bg-orange-100 text-orange-800',
        action: '查看进度'
      },
      completed: {
        text: '待确认',
        color: 'bg-green-100 text-green-800',
        action: '确认完成'
      },
      confirmed: {
        text: '已完成',
        color: 'bg-gray-100 text-gray-800',
        action: null
      }
    };
    return statusInfo[order.status] || statusInfo.pending;
  };
  const statusInfo = getStatusInfo();
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold flex-1">订单详情</h1>
        <Badge className={statusInfo.color}>
          {statusInfo.text}
        </Badge>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid grid-cols-3 px-4">
          <TabsTrigger value="info">订单信息</TabsTrigger>
          <TabsTrigger value="map">地图位置</TabsTrigger>
          <TabsTrigger value="actions">操作</TabsTrigger>
        </TabsList>

        {/* 订单信息 */}
        <TabsContent value="info" className="p-4 space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-semibold text-gray-900">{order.title}</h2>
              {order.urgency === 'high' && <div className="flex items-center text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm font-medium">紧急</span>
                </div>}
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-400" />
                <span className="flex-1">{order.address}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                <span>创建时间：{order.createTime}</span>
              </div>
              {order.expectedTime && <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  <span>期望完成：{order.expectedTime}</span>
                </div>}
              {order.technician && <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User size={16} className="mr-2 text-gray-400" />
                    <span>接单技工：{order.technician}</span>
                  </div>
                  {order.rating && <div className="flex items-center text-yellow-500">
                      <Star size={14} className="mr-1" />
                      <span className="text-sm">{order.rating}</span>
                    </div>}
                </div>}
            </div>
          </div>

          {/* 需求描述 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">需求描述</h3>
            <p className="text-gray-600 leading-relaxed">{order.description}</p>
          </div>

          {/* 费用信息 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-3">费用信息</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">用户预算</span>
              <span className="font-semibold">¥{order.budget}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">实际报价</span>
              <span className="text-2xl font-bold text-blue-600">¥{order.price}</span>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <Shield size={14} className="mr-1" />
              <span>平台资金托管，安全有保障</span>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <Phone size={16} className="mr-1" />
              联系方式
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{order.contact}</span>
              <div className="flex gap-2">
                <Button variant="outline" className="text-blue-600 border-blue-600">
                  拨打电话
                </Button>
                <Button variant="outline" className="text-green-600 border-green-600">
                  <MessageSquare size={16} className="mr-1" />
                  在线沟通
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 地图位置 */}
        <TabsContent value="map" className="p-4 space-y-4">
          {/* 订单地图视图 */}
          <OrderMapView order={order} userLocation={userLocation} />

          {/* 距离计算器 */}
          {userType === 'technician' && userLocation && order.location && <DistanceCalculator fromLocation={userLocation} toLocation={order.location} />}

          {/* 进度跟踪 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">进度跟踪</h3>
            <div className="space-y-4">
              {order.progress.map((item, index) => <div key={index} className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mt-1 mr-3 ${item.status === 'completed' ? 'bg-green-500' : item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-medium ${item.status === 'completed' ? 'text-green-600' : item.status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.action}
                      </span>
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* 工作凭证上传 */}
          {userType === 'technician' && order.status === 'accepted' && <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText size={16} className="mr-1" />
                工作凭证
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map(file => <div key={file.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">{file.time}</span>
                  </div>)}
                <Button onClick={handleUploadFile} variant="outline" className="w-full">
                  <FileText size={16} className="mr-2" />
                  上传工作凭证
                </Button>
              </div>
            </div>}
        </TabsContent>

        {/* 操作区域 */}
        <TabsContent value="actions" className="p-4 space-y-4">
          {/* 技工操作 */}
          {userType === 'technician' && order.status === 'pending' && <Button onClick={handleAcceptOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-lg">
              立即接单
            </Button>}

          {userType === 'technician' && order.status === 'accepted' && <Button onClick={handleCompleteOrder} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-lg">
              标记完成
            </Button>}

          {/* 用户操作 */}
          {userType === 'customer' && order.status === 'completed' && <Button onClick={handleConfirmCompletion} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-lg">
              确认完成
            </Button>}

          {/* 评价区域 */}
          {order.status === 'confirmed' && !order.rating && <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center">
                <Star size={16} className="mr-1" />
                服务评价
              </h3>
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => handleRate(star)} className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ⭐
                  </button>)}
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="请输入您的评价（可选）" rows={3} className="w-full p-2 border border-gray-300 rounded-lg mb-3" />
              <Button onClick={handleSubmitComment} className="w-full">
                提交评价
              </Button>
            </div>}

          {order.rating && <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center">
              <CheckCircle className="text-green-500 mr-2" size={20} />
              <span className="text-gray-600">已评价：{order.rating}星</span>
            </div>}

          {/* 纠纷处理 */}
          {(order.status === 'accepted' || order.status === 'completed') && <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 text-red-600">纠纷处理</h3>
              <p className="text-sm text-gray-600 mb-3">如遇服务问题，可申请平台介入处理</p>
              <Button variant="outline" className="w-full text-red-600 border-red-600">
                申请平台介入
              </Button>
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
}