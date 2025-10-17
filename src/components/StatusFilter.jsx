// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';

export function StatusFilter({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    value: 'all',
    label: '全部订单',
    count: null
  }, {
    value: 'pending',
    label: '待接单',
    count: null
  }, {
    value: 'processing',
    label: '进行中',
    count: null
  }, {
    value: 'completed',
    label: '已完成',
    count: null
  }, {
    value: 'disputed',
    label: '纠纷中',
    count: null
  }];
  return <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {tabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
            {tab.count !== null && <span className="ml-1 text-xs bg-gray-200 px-1 rounded">{tab.count}</span>}
          </TabsTrigger>)}
      </TabsList>
    </Tabs>;
}