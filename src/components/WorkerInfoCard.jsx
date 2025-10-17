// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
// @ts-ignore;
import { Star, Phone, MessageCircle } from 'lucide-react';

export function WorkerInfoCard({
  worker
}) {
  return <Card>
      <CardHeader>
        <CardTitle>接单人信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={worker.avatar} />
            <AvatarFallback>{worker.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold">{worker.name}</h4>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1">{worker.rating}分</span>
              <span className="ml-2">已完成{worker.completed_count}单</span>
            </div>
            <p className="text-sm text-gray-600">专业：{worker.specialty}</p>
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
    </Card>;
}