// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, Download } from 'lucide-react';

import { OrderCard } from '@/components/OrderCard';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { StatusFilter } from '@/components/StatusFilter';
export default function PlatformOrderManage(props) {
  const {
    $w
  } = props;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadOrders();
  }, []);
  useEffect(() => {
    filterOrders();
  }, [orders, activeTab, searchTerm]);
  const loadOrders = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaGetRecordsV2',
        params: {
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
  const filterOrders = () => {
    let filtered = orders;
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    if (searchTerm) {
      filtered = filtered.filter(order => order.order_number.includes(searchTerm) || order.customer_info?.name.includes(searchTerm) || order.service_address.includes(searchTerm));
    }
    setFilteredOrders(filtered);
  };
  const handleViewDetail = order => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };
  const handleProcessOrder = async (order, action) => {
    try {
      let updateData = {};
      let successMessage = '';
      switch (action) {
        case 'settle':
          updateData = {
            status: 'settled'
          };
          successMessage = '订单已结算';
          // 更新资金托管状态
          await $w.cloud.callDataSource({
            dataSourceName: 'electric_escrow',
            methodName: 'wedaUpdateV2',
            params: {
              data: {
                status: 'completed',
                settlement_time: new Date().getTime()
              },
              filter: {
                where: {
                  demand_id: {
                    $eq: order._id
                  }
                }
              }
            }
          });
          break;
        case 'resolve':
          updateData = {
            status: 'completed'
          };
          successMessage = '纠纷已处理';
          break;
        case 'cancel':
          updateData = {
            status: 'cancelled'
          };
          successMessage = '订单已取消';
          break;
      }
      await $w.cloud.callDataSource({
        dataSourceName: 'electric_demand',
        methodName: 'wedaUpdateV2',
        params: {
          data: updateData,
          filter: {
            where: {
              _id: {
                $eq: order._id
              }
            }
          }
        }
      });
      toast({
        title: '操作成功',
        description: successMessage
      });
      loadOrders();
      setShowDetailModal(false);
    } catch (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleExport = () => {
    const csvContent = [['订单号', '业务类型', '状态', '客户', '技工', '预算', '地址', '发布时间'], ...filteredOrders.map(order => [order.order_number, order.business_type, order.status, order.customer_info?.name || '', order.worker_info?.name || '', order.budget, order.service_address, new Date(order.publish_time).toLocaleString('zh-CN')])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `订单列表_${new Date().toLocaleDateString('zh-CN')}.csv`;
    link.click();
  };
  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      disputed: orders.filter(o => o.status === 'disputed').length
    };
  };
  const stats = getStats();
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
              <p className="text-sm text-gray-600 mt-1">平台订单管理中心</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                导出数据
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">总订单</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-orange-600">待接单</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <div className="text-sm text-blue-600">进行中</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-green-600">已完成</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.disputed}</div>
            <div className="text-sm text-red-600">纠纷中</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="搜索订单号、客户姓名或地址..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="按时间排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新发布</SelectItem>
                <SelectItem value="oldest">最早发布</SelectItem>
                <SelectItem value="budget-high">预算最高</SelectItem>
                <SelectItem value="budget-low">预算最低</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 状态筛选 */}
        <StatusFilter activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 订单列表 */}
        <div className="mt-6">
          {filteredOrders.length === 0 ? <div className="text-center py-12">
              <div className="text-gray-500">暂无订单</div>
            </div> : <div className="grid gap-4">
              {filteredOrders.map(order => <OrderCard key={order._id} order={order} onViewDetail={handleViewDetail} onProcess={handleProcessOrder} />)}
            </div>}
        </div>
      </div>

      <OrderDetailModal order={selectedOrder} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>;
}