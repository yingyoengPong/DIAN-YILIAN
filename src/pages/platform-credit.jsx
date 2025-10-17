// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
// @ts-ignore;
import { Star, TrendingUp, TrendingDown, User, Award } from 'lucide-react';

const mockUsers = [{
  id: 1,
  name: '张师傅',
  type: 'worker',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  creditScore: 95,
  level: '钻石',
  completedOrders: 156,
  rating: 4.9,
  trend: 'up'
}, {
  id: 2,
  name: '李师傅',
  type: 'worker',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  creditScore: 88,
  level: '黄金',
  completedOrders: 89,
  rating: 4.7,
  trend: 'up'
}, {
  id: 3,
  name: '王女士',
  type: 'customer',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
  creditScore: 92,
  level: '铂金',
  completedOrders: 12,
  rating: 4.8,
  trend: 'down'
}];
export default function PlatformCredit(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('all');
  const getLevelBadge = level => {
    const levelMap = {
      '钻石': {
        color: 'bg-purple-100 text-purple-800',
        icon: Award
      },
      '铂金': {
        color: 'bg-blue-100 text-blue-800',
        icon: Award
      },
      '黄金': {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Award
      },
      '白银': {
        color: 'bg-gray-100 text-gray-800',
        icon: Award
      }
    };
    return levelMap[level] || {
      color: 'bg-gray-100 text-gray-800',
      icon: Award
    };
  };
  const getScoreColor = score => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  const filteredUsers = activeTab === 'all' ? mockUsers : mockUsers.filter(user => user.type === activeTab);
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 border-b">
        <h1 className="text-lg font-semibold text-center">信用分管理</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>信用分统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
                <p className="text-sm text-gray-600">总用户数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">89.5</p>
                <p className="text-sm text-gray-600">平均信用分</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="customer">客户</TabsTrigger>
            <TabsTrigger value="worker">技工</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="p-0">
            <div className="space-y-4">
              {filteredUsers.map(user => {
              const level = getLevelBadge(user.level);
              const LevelIcon = level.icon;
              return <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{user.name}</h4>
                            <Badge className={level.color}>
                              <LevelIcon className="h-3 w-3 mr-1" />
                              {user.level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span>信用分: <span className={`font-semibold ${getScoreColor(user.creditScore)}`}>{user.creditScore}</span></span>
                            <span>完成订单: {user.completedOrders}</span>
                            <span>评分: {user.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {user.trend === 'up' ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        <Button variant="outline" size="sm">
                          调整分数
                        </Button>
                        <Button variant="outline" size="sm">
                          查看订单
                        </Button>
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}