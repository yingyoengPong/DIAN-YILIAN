// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { User, HardHat, Shield } from 'lucide-react';

export default function HomePage(props) {
  const {
    $w
  } = props;
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">用电业务报装助手</h1>
          <p className="text-lg text-gray-600">专业、安全、高效的用电报装服务平台</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2 text-green-600" />
                用户端
              </CardTitle>
              <CardDescription>发布用电需求，寻找专业技工</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => $w.utils.navigateTo({
              pageId: 'user-register'
            })}>
                进入用户端
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardHat className="h-6 w-6 mr-2 text-blue-600" />
                技工端
              </CardTitle>
              <CardDescription>接单服务，提供专业用电安装</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => $w.utils.navigateTo({
              pageId: 'worker-register'
            })}>
                进入技工端
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-purple-600" />
                平台管理
              </CardTitle>
              <CardDescription>订单管理，资金托管，纠纷处理</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => $w.utils.navigateTo({
              pageId: 'platform-order-manage'
            })}>
                进入管理后台
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="text-sm text-gray-500">
            <p>选择您的身份，开始专业的用电报装服务</p>
            <p className="mt-2">平台保障 · 资金安全 · 专业服务</p>
          </div>
        </div>
      </div>
    </div>;
}