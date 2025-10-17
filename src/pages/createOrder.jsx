// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { ArrowLeft, MapPin, Calendar, DollarSign, AlertCircle, Clock } from 'lucide-react';

import { MapSelector } from '@/components/MapSelector';
export default function CreateOrder(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    location: null,
    description: '',
    budget: '',
    urgency: 'normal',
    contact: $w.auth.currentUser?.name ? `${$w.auth.currentUser.name} - ${$w.auth.currentUser.nickName || ''}`.trim() : '',
    expectedTime: '',
    serviceType: 'installation'
  });
  const serviceTypes = [{
    value: 'installation',
    label: '用电报装'
  }, {
    value: 'maintenance',
    label: '电路维修'
  }, {
    value: 'upgrade',
    label: '用电增容'
  }, {
    value: 'inspection',
    label: '安全检测'
  }, {
    value: 'other',
    label: '其他服务'
  }];
  const handleLocationSelect = locationData => {
    setFormData(prev => ({
      ...prev,
      address: locationData.address,
      location: {
        lng: locationData.lng,
        lat: locationData.lat
      }
    }));
  };
  const handleSubmit = async () => {
    if (!formData.title || !formData.address || !formData.description || !formData.contact) {
      toast({
        title: '请填写完整信息',
        variant: 'destructive',
        description: '请确保标题、地址、描述和联系方式都已填写'
      });
      return;
    }
    if (!formData.location) {
      toast({
        title: '请选择准确位置',
        variant: 'destructive',
        description: '请在地图上选择服务地址'
      });
      return;
    }
    if (formData.budget && (formData.budget < 100 || formData.budget > 100000)) {
      toast({
        title: '预算范围错误',
        variant: 'destructive',
        description: '预算范围应在100-100000元之间'
      });
      return;
    }
    try {
      // 创建订单数据，包含位置信息
      const orderData = {
        title: formData.title,
        address: formData.address,
        location: formData.location,
        description: formData.description,
        budget: formData.budget,
        urgency: formData.urgency,
        contact: formData.contact,
        expectedTime: formData.expectedTime,
        serviceType: formData.serviceType,
        status: 'pending',
        createTime: new Date().toISOString()
      };
      // 调用数据模型创建订单
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            customer_id: $w.auth.currentUser?.userId,
            customer_info: {
              name: formData.contact.split(' - ')[0],
              phone: formData.contact.split(' - ')[1] || ''
            },
            service_address: formData.address,
            location: formData.location,
            demand_description: formData.description,
            business_type: formData.serviceType,
            budget: parseFloat(formData.budget),
            status: 'pending',
            publish_time: new Date().getTime(),
            appointment_time: formData.expectedTime ? new Date(formData.expectedTime).getTime() : null
          }
        }
      });
      toast({
        title: '发布成功',
        description: '您的用电报装需求已发布，技工将很快联系您'
      });
      $w.utils.navigateBack();
    } catch (error) {
      toast({
        title: '发布失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const getUrgencyDescription = urgency => {
    const descriptions = {
      low: '不紧急，可安排在未来几天内完成',
      normal: '一般紧急，希望尽快安排',
      high: '非常紧急，需要立即处理'
    };
    return descriptions[urgency] || '';
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold flex-1">发布用电报装需求</h1>
      </div>

      {/* 表单内容 */}
      <div className="p-4 space-y-4 pb-24">
        {/* 服务类型 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">服务类型</label>
          <Select value={formData.serviceType} onValueChange={value => updateFormData('serviceType', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择服务类型" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map(type => <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* 需求标题 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">需求标题 *</label>
          <input type="text" value={formData.title} onChange={e => updateFormData('title', e.target.value)} placeholder="例如：家庭用电报装、商铺用电增容" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* 地图地址选择器 */}
        <MapSelector onLocationSelect={handleLocationSelect} initialAddress={formData.address} />

        {/* 需求描述 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">需求描述 *</label>
          <textarea value={formData.description} onChange={e => updateFormData('description', e.target.value)} placeholder="请详细描述您的用电需求，例如：安装位置、用电设备功率、特殊要求、现有电路情况等" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* 预算范围 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DollarSign size={16} className="mr-1" />
            预算范围（元）
          </label>
          <input type="number" value={formData.budget} onChange={e => updateFormData('budget', e.target.value)} placeholder="请输入您的预算金额" min="100" max="100000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="text-xs text-gray-500 mt-1">预算范围：100-100000元</div>
        </div>

        {/* 期望完成时间 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Clock size={16} className="mr-1" />
            期望完成时间
          </label>
          <input type="text" value={formData.expectedTime} onChange={e => updateFormData('expectedTime', e.target.value)} placeholder="例如：3天内、本周内、具体日期" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* 紧急程度 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            紧急程度
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[{
            value: 'low',
            label: '不紧急',
            color: 'bg-green-100 text-green-800 border-green-200',
            activeColor: 'bg-green-500 text-white'
          }, {
            value: 'normal',
            label: '一般',
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            activeColor: 'bg-blue-500 text-white'
          }, {
            value: 'high',
            label: '紧急',
            color: 'bg-red-100 text-red-800 border-red-200',
            activeColor: 'bg-red-500 text-white'
          }].map(item => <button key={item.value} onClick={() => updateFormData('urgency', item.value)} className={`p-3 rounded-lg border text-center transition-colors font-medium ${formData.urgency === item.value ? `${item.activeColor} border-transparent` : `${item.color} border-gray-200 hover:border-gray-300`}`}>
                {item.label}
              </button>)}
          </div>
          <div className="text-xs text-gray-500">{getUrgencyDescription(formData.urgency)}</div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">联系方式 *</label>
          <input type="text" value={formData.contact} onChange={e => updateFormData('contact', e.target.value)} placeholder="请输入姓名和手机号，技工会通过此方式联系您" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* 提交按钮 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-lg shadow-lg">
            发布需求
          </Button>
        </div>
      </div>
    </div>;
}