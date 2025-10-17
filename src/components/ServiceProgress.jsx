// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { CheckCircle } from 'lucide-react';

export function ServiceProgress({
  status
}) {
  const steps = [{
    label: '已发布',
    completed: true
  }, {
    label: '已接单',
    completed: status !== 'pending'
  }, {
    label: '服务进行中',
    completed: status === 'processing' || status === 'completed'
  }, {
    label: '服务完成',
    completed: status === 'completed'
  }];
  return <Card>
      <CardHeader>
        <CardTitle>服务进度</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => <div key={index} className="flex items-center">
              {step.completed ? <CheckCircle className="h-6 w-6 text-green-500 mr-3" /> : <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3" />}
              <span className={step.completed ? 'text-gray-900' : 'text-gray-500'}>{step.label}</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}